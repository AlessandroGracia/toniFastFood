import type { ProblemDetails } from "@tonios/contracts";

export class ToniOSError extends Error {
  readonly problem: ProblemDetails;

  constructor(problem: ProblemDetails) {
    super(problem.title);
    this.name = "ToniOSError";
    this.problem = problem;
  }
}

export function createProblem(problem: ProblemDetails): ProblemDetails {
  return problem;
}
