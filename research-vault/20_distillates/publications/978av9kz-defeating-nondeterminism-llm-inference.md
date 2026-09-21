---
type: distillate
source-type: publication
reference: 978AV9KZ
record-id: 978AV9KZ
work-id: work:4842d83e-8ed6-5633-b241-febb6e9c710f
version-id: version:289ac267-2c86-54d2-a7ea-80ab49a289f3
version-type: unknown
topics:
- '[[Reproducible LLM inference]]'
status: ai-agent-reviewed
checked:
  quote: 2026-09-21
  validation: '2026-09-21'
  ai-agent-review: '2026-09-21'
created: 2026-09-21
updated: '2026-09-21'
prepared-by:
  agent-id: /root/knowledge_documents
  model: gpt-5.6-sol
  prepared-at: 2026-09-21
  artifact-review-status: ai-agent-reviewed
source-representation:
  path: generated/markdown_clean/FTJM5R8N.md
  sha256: sha256:06cb8ae6cbf58054af2449750c5eb0512a425262cd1e77be1ff27a2fbc102fd8
  version-id: version:289ac267-2c86-54d2-a7ea-80ab49a289f3
  version-type: unknown
  source-url: https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/
  is-preferred-version: true
  boundary: The preparing agent read the complete hash-bound official article projection and checked the quoted passages. Bibliographic identity follows the BibTeX supplied in the article body. The registered source version type remains unknown. No separate scholarly review has occurred.
source-review:
  path: corpus/knowledge-reviews/2026-09-21/978AV9KZ-authority.json
  sha256: sha256:8fa8d14cab81c76b6df46dcd7d2db274d3ba963c1e54a8daed0f86f041647014
---

# Distillate: Reproducible large language model inference through batch-invariant kernels

The article explains why temperature-zero large language model inference can remain nondeterministic and demonstrates an inference implementation designed to produce bitwise-identical results. Its central diagnosis is that server load changes batching, while common kernels are deterministic for fixed inputs but not invariant to batch shape and sequence partitioning.

## Core statements

- Variable batching, rather than concurrent atomic addition in the forward pass, is identified as the main system-level source of nondeterminism. ^s1
  > "the primary reason nearly all LLM inference endpoints are nondeterministic is that the load (and thus batch-size) nondeterministically varies!" (10.64434/tml.20250910)

- Deterministic inference requires invariant numerics across the batching decisions of the serving system. ^s2
  > "we must achieve batch invariance in our kernels." (10.64434/tml.20250910)

- The demonstration replaces relevant operations in vLLM with batch-invariant implementations. ^s3
  > "We provide a demonstration of deterministic inference on top of vLLM by leveraging its FlexAttention backend as well as torch.Library." (10.64434/tml.20250910)

- In the reported generation experiment, the modified kernels remove the observed temperature-zero variation. ^s4
  > "when we enable our batch-invariant kernels, all of our 1000 completions are identical." (10.64434/tml.20250910)

## Research question and method

The article asks why repeated large language model inference can yield different outputs even with greedy sampling, and how an inference server can eliminate that variation. It separates run-to-run kernel determinism from batch invariance. The technical analysis traces floating-point reduction order through RMSNorm, matrix multiplication, and attention, the three forward-pass operation families that contain reductions.

The proposed implementation uses fixed reduction strategies for RMSNorm and matrix multiplication and a fixed split-size strategy for attention. It also updates the key-value cache and page table before attention so that reduction order does not depend on whether tokens are processed during prefill, chunked prefill, or decoding. A demonstration integrates these kernels with the vLLM FlexAttention backend through `torch.Library` operator substitution.

The experiments compare ordinary and batch-invariant inference. One test requests 1,000 temperature-zero completions from Qwen/Qwen3-235B-A22B-Instruct-2507 for the same prompt. A separate performance test serves Qwen-3-8B on one graphics processing unit. A reinforcement-learning experiment compares ordinary sampling, importance-weighted correction, and bitwise alignment between the sampler and trainer in an RLVR setup using Qwen 2.5-VL instruct 8B on Bigmath.

## Main findings

The article argues that floating-point non-associativity explains why different reduction orders produce different numbers, but not why a fixed user request encounters different orders. Modern forward-pass kernels can be run-to-run deterministic for fixed inputs. The serving system nevertheless changes batch sizes and sequence partitioning in response to load, and common high-performance kernels change their reduction strategy with those shapes. The resulting composition makes endpoint output nondeterministic from the caller's perspective.

In the completion experiment, ordinary inference produced 80 unique outputs across 1,000 greedy completions. The outputs first diverged at token 103. All 1,000 completions were identical with the batch-invariant kernels. The implementation retained usable performance, although the article does not report a thoroughly optimized system. In the reinforcement-learning experiment, matching sampler and trainer numerics kept the reported log-probability divergence at zero and avoided the reward collapse observed without off-policy correction.

## Assessment relevance

`Generative_KI` is central because the article studies reproducibility in generative large language model serving and training. `KI_Sonstige` is also central because the main contribution concerns numerical kernels, inference-engine batching, and reinforcement-learning infrastructure rather than generated content. `Prompting` is not a substantive focus. The repeated prompt is an experimental control, not a study of prompt design. The article does not address social work, gender, diversity, feminist perspectives, social inequality, or fairness as assessment subjects.

## Limitations

The article presents a technical demonstration rather than a peer-reviewed comparative evaluation. Its completion experiment uses one model, one prompt, greedy decoding, and a fixed output length. The performance implementation had not received substantial optimization, and the source gives only a qualitative performance assessment in the text projection. Some required FlexAttention changes were not included in the referenced code release at publication time. Bitwise reproducibility is demonstrated for the described stack and does not establish invariance across hardware, software versions, models, quantization schemes, or distributed configurations.

The registered bibliographic version type is `unknown` and remains so here. The article-body BibTeX supplies the title, authorship, venue label, year, URL, and DOI used by the CSL record. This identity evidence does not determine a more specific publication-version class.

## Review boundary

This document was prepared from the source representation identified in its metadata. The current review state and its supporting receipt are recorded in the frontmatter. AI review does not establish domain-expert verification or publication approval.
