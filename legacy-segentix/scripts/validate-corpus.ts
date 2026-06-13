#!/usr/bin/env tsx
/**
 * F7 — Mapping-corpus validator.
 *
 * Reads `corpus/frameworks.yaml` and every `corpus/mappings/*.yaml`,
 * validates structure with zod, and enforces cross-file invariants:
 *
 *   - Every mapping.id is unique across all mapping files.
 *   - Every `source.framework` and `target.framework` exists in the registry.
 *   - Every `source.id` and `target.control` exists in that framework's
 *     `controls:` list, unless the framework's list is empty (= unconstrained,
 *     for frameworks that are still being seeded).
 *
 * Orphan controls (in registry but never cited by any mapping) are reported
 * as warnings, never failures, since the registry is allowed to be broader
 * than the current mapping coverage.
 *
 * `--strict` additionally fails on:
 *   - any mapping with status: draft
 *   - any orphan control
 *
 * Exit code: 0 clean, 1 on any error (or warning in --strict).
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { parse as parseYaml } from "yaml";
import { z } from "zod";

const REPO_ROOT = join(__dirname, "..");
const CORPUS_DIR = join(REPO_ROOT, "corpus");
const MAPPINGS_DIR = join(CORPUS_DIR, "mappings");
const FRAMEWORKS_FILE = join(CORPUS_DIR, "frameworks.yaml");

const STRICT = process.argv.includes("--strict");

// ---------------------------------------------------------------- schema

const ControlEntry = z.object({
  id: z.string().min(1),
  name: z.string().optional(),
});

const FrameworkEntry = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  version: z.string().min(1),
  url: z.string().url().optional(),
  controls: z.array(ControlEntry),
});

const FrameworksFile = z.object({
  frameworks: z.array(FrameworkEntry).min(1),
});

const Relationship = z.enum([
  "satisfies",
  "partially-satisfies",
  "informs",
  "supports",
]);

const SourceRef = z.object({
  framework: z.string().min(1),
  id: z.string().min(1),
  name: z.string().optional(),
});

const TargetRef = z.object({
  framework: z.string().min(1),
  control: z.string().min(1),
  relationship: Relationship,
  notes: z.string().optional(),
});

const Mapping = z.object({
  id: z
    .string()
    .regex(/^[a-z0-9][a-z0-9-]*$/, "mapping.id must be kebab-case"),
  source: SourceRef,
  description: z.string().min(1),
  targets: z.array(TargetRef).min(1),
  status: z.enum(["draft", "reviewed", "published"]).default("draft"),
  review_notes: z.string().optional(),
});

const MappingFile = z.object({
  mappings: z.array(Mapping).min(1),
});

// ---------------------------------------------------------------- helpers

type Problem = { file: string; level: "error" | "warn"; message: string };

const problems: Problem[] = [];

function err(file: string, message: string) {
  problems.push({ file, level: "error", message });
}

function warn(file: string, message: string) {
  problems.push({ file, level: "warn", message });
}

function rel(p: string) {
  return relative(REPO_ROOT, p);
}

function readYaml(path: string): unknown {
  return parseYaml(readFileSync(path, "utf8"));
}

function listMappingFiles(): string[] {
  let entries: string[];
  try {
    entries = readdirSync(MAPPINGS_DIR);
  } catch {
    return [];
  }
  return entries
    .filter((n) => n.endsWith(".yaml") || n.endsWith(".yml"))
    .map((n) => join(MAPPINGS_DIR, n))
    .filter((p) => statSync(p).isFile())
    .sort();
}

// ---------------------------------------------------------------- main

function main(): number {
  // Frameworks registry.
  let frameworksRaw: unknown;
  try {
    frameworksRaw = readYaml(FRAMEWORKS_FILE);
  } catch (e) {
    err(rel(FRAMEWORKS_FILE), `cannot read: ${(e as Error).message}`);
    return report();
  }

  const fwParsed = FrameworksFile.safeParse(frameworksRaw);
  if (!fwParsed.success) {
    for (const issue of fwParsed.error.issues) {
      err(
        rel(FRAMEWORKS_FILE),
        `${issue.path.join(".") || "(root)"}: ${issue.message}`,
      );
    }
    return report();
  }

  const frameworks = new Map<
    string,
    { name: string; controls: Map<string, string | undefined> }
  >();
  for (const f of fwParsed.data.frameworks) {
    if (frameworks.has(f.id)) {
      err(rel(FRAMEWORKS_FILE), `duplicate framework id: ${f.id}`);
      continue;
    }
    const controls = new Map<string, string | undefined>();
    for (const c of f.controls) {
      if (controls.has(c.id)) {
        err(rel(FRAMEWORKS_FILE), `${f.id}: duplicate control id: ${c.id}`);
        continue;
      }
      controls.set(c.id, c.name);
    }
    frameworks.set(f.id, { name: f.name, controls });
  }

  // Mapping files.
  const mappingFiles = listMappingFiles();
  if (mappingFiles.length === 0) {
    warn(rel(MAPPINGS_DIR), "no mapping files found");
  }

  const seenMappingIds = new Map<string, string>(); // id -> file
  const cited = new Map<string, Set<string>>(); // framework -> control ids

  function cite(framework: string, control: string) {
    let set = cited.get(framework);
    if (!set) {
      set = new Set();
      cited.set(framework, set);
    }
    set.add(control);
  }

  let draftCount = 0;
  let mappingCount = 0;

  for (const file of mappingFiles) {
    const rfile = rel(file);
    let raw: unknown;
    try {
      raw = readYaml(file);
    } catch (e) {
      err(rfile, `cannot parse: ${(e as Error).message}`);
      continue;
    }

    const parsed = MappingFile.safeParse(raw);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        err(rfile, `${issue.path.join(".") || "(root)"}: ${issue.message}`);
      }
      continue;
    }

    for (const m of parsed.data.mappings) {
      mappingCount++;
      if (m.status === "draft") draftCount++;

      const prev = seenMappingIds.get(m.id);
      if (prev) {
        err(rfile, `duplicate mapping id "${m.id}" (also in ${prev})`);
      } else {
        seenMappingIds.set(m.id, rfile);
      }

      // source
      const srcFw = frameworks.get(m.source.framework);
      if (!srcFw) {
        err(
          rfile,
          `${m.id}: source.framework "${m.source.framework}" not in registry`,
        );
      } else if (srcFw.controls.size > 0 && !srcFw.controls.has(m.source.id)) {
        err(
          rfile,
          `${m.id}: source ${m.source.framework}/${m.source.id} not in registry`,
        );
      } else {
        cite(m.source.framework, m.source.id);
      }

      // targets
      const seenTarget = new Set<string>();
      for (const t of m.targets) {
        const key = `${t.framework}/${t.control}`;
        if (seenTarget.has(key)) {
          err(rfile, `${m.id}: duplicate target ${key}`);
        }
        seenTarget.add(key);

        const fw = frameworks.get(t.framework);
        if (!fw) {
          err(rfile, `${m.id}: target.framework "${t.framework}" not in registry`);
          continue;
        }
        if (fw.controls.size > 0 && !fw.controls.has(t.control)) {
          err(rfile, `${m.id}: target ${key} not in registry`);
          continue;
        }
        cite(t.framework, t.control);
      }
    }
  }

  // Orphan controls: registered but never cited.
  for (const [fwId, fw] of frameworks) {
    if (fw.controls.size === 0) continue;
    const citedSet = cited.get(fwId) ?? new Set<string>();
    const orphans: string[] = [];
    for (const cid of fw.controls.keys()) {
      if (!citedSet.has(cid)) orphans.push(cid);
    }
    if (orphans.length > 0) {
      warn(
        rel(FRAMEWORKS_FILE),
        `${fwId}: ${orphans.length} orphan control(s) (no mapping cites them): ${orphans.join(", ")}`,
      );
    }
  }

  // Summary.
  console.log(
    `corpus: ${mappingCount} mapping(s) across ${mappingFiles.length} file(s); ${draftCount} draft, ${frameworks.size} framework(s) registered`,
  );

  return report({ draftCount });
}

function report(extra?: { draftCount?: number }): number {
  const errors = problems.filter((p) => p.level === "error");
  const warnings = problems.filter((p) => p.level === "warn");

  for (const p of problems) {
    const tag = p.level === "error" ? "ERROR" : "warn ";
    console.log(`  [${tag}] ${p.file}: ${p.message}`);
  }

  let exit = errors.length > 0 ? 1 : 0;
  if (STRICT) {
    if (warnings.length > 0) exit = 1;
    if (extra?.draftCount && extra.draftCount > 0) {
      console.log(
        `  [ERROR] --strict: ${extra.draftCount} mapping(s) still status: draft`,
      );
      exit = 1;
    }
  }

  if (exit === 0) {
    console.log(
      warnings.length > 0
        ? `OK with ${warnings.length} warning(s).`
        : "OK.",
    );
  } else {
    console.log(`FAIL: ${errors.length} error(s), ${warnings.length} warning(s).`);
  }

  return exit;
}

process.exit(main());
