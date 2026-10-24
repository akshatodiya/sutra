# Dataset Card: sutra_raw

## Summary

- **Run timestamp**: 2026-10-24T09:38:10.046301Z
- **Wall clock time**: 0.0s
- **Pipeline config hash**: `raw`

## Source Documents

  - Unknown

## Pipeline Stages

| Step | Input | Passed | Recovered | Rejected | Forward |
|------|-------|--------|-----------|----------|---------|
| Rows | 1632 | 1632 | — | 0 | 1632 |
| MatchTaskCounts | 1632 | 295 | — | — | 295 |
| MessagesExporter | — | 295 | — | — | 295 |

## Gate Pass Rates and Rejection Breakdown

- **Rows**: 1632/0 passed (N/A), 0 rejected


**Rejection reasons:**
  - None

## Deduplication

  - No deduplication step recorded

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
