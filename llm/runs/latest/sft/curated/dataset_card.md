# Dataset Card: sutra_curated

## Summary

- **Run timestamp**: 2026-10-28T03:55:19.101545Z
- **Wall clock time**: 0.1s
- **Pipeline config hash**: `curated`

## Source Documents

  - Unknown

## Pipeline Stages

| Step | Input | Passed | Recovered | Rejected | Forward |
|------|-------|--------|-----------|----------|---------|
| Rows | 2103 | 2103 | - | 0 | 2103 |
| InterpreterGate | 2103 | 1337 | 0 | 766 | 1337 |
| ExactDeduplicator | 1337 | 319 | - | - | 319 |
| FewestSteps | 319 | 298 | - | - | 298 |
| MessagesExporter | - | 298 | - | - | 298 |

## Gate Pass Rates and Rejection Breakdown

- **Rows**: 2103/0 passed (N/A), 0 rejected
- **InterpreterGate**: 1337/2103 passed (63.6%), 766 rejected


**Rejection reasons:**
  - `interpreter:parse_error`: 272
  - `interpreter:wrong_answer`: 247
  - `interpreter:unbound`: 210
  - `interpreter:type_error`: 28
  - `interpreter:runtime_error`: 9

## Deduplication

  - exact_duplicates_removed: 1018

## Known Limitations

- No MinHash deduplication applied.
- Table extraction requires `extract_tables: true` on the PDF reader and MinerU with GPU support. Disabled by default.
- Token counting uses a whitespace tokenizer by default. For exact LLM context window
  enforcement, enable `use_tiktoken: true` in the SchemaGate config.
- Both within-run (MinHash/Diversity) and cross-run (EmbeddingDeduplicator) deduplication
  are available. Cross-run dedup persists an embedding index across runs; use
  `embedding_reset_index: true` to start fresh.

## Reproduction

```bash
pip install curatorkit
curatorkit run pipeline.yaml --output-dir ./out/
```

## Tool Versions

- **curatorkit**: 0.1.22
- **python**: 3.13.15
