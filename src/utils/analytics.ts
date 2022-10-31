export const initAnalytics = () => {
  window.ga =
    window.ga ||
    (((...args: any[]) =>
      (ga.q = ga.q || []).push(args)) as unknown as UniversalAnalytics.ga);

  ga("create", "UA-29212656-4", "auto");

  ga("set", "transport", "beacon");
  ga("send", "pageview");
};
