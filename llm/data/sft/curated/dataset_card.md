# Dataset Card: sutra_curated

## Summary

- **Run timestamp**: 2026-10-24T09:38:10.041448Z
- **Wall clock time**: 0.0s
- **Pipeline config hash**: `curated`

## Source Documents

  - Unknown

## Pipeline Stages

| Step | Input | Passed | Recovered | Rejected | Forward |
|------|-------|--------|-----------|----------|---------|
| Rows | 2088 | 2088 | - | 0 | 2088 |
| InterpreterGate | 2088 | 1314 | 0 | 774 | 1314 |
| ExactDeduplicator | 1314 | 319 | - | - | 319 |
| FewestSteps | 319 | 295 | - | - | 295 |
| MessagesExporter | - | 295 | - | - | 295 |

## Gate Pass Rates and Rejection Breakdown

- **Rows**: 2088/0 passed (N/A), 0 rejected
- **InterpreterGate**: 1314/2088 passed (62.9%), 774 rejected


**Rejection reasons:**
  - `interpreter:parse_error`: 301
  - `interpreter:wrong_answer`: 232
  - `interpreter:unbound`: 200
  - `interpreter:type_error`: 36
  - `interpreter:runtime_error`: 5

## Deduplication

  - exact_duplicates_removed: 995

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
- **python**: 3.15.0
