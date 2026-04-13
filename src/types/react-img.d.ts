// React's ImgHTMLAttributes only declares fetchPriority (camelCase),
// but the HTML spec attribute is fetchpriority (lowercase). React's runtime
// in some versions warns on camelCase and errors on lowercase — this augment
// satisfies both TypeScript and the DOM without suppressing errors elsewhere.
import "react";

declare module "react" {
  interface ImgHTMLAttributes<T> {
    fetchpriority?: "high" | "low" | "auto";
  }
}
