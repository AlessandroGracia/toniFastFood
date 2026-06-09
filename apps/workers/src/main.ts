console.log(
  JSON.stringify({
    level: "info",
    service: "tonios-workers",
    message: "Worker runtime ready. Event consumers will be registered in future slices.",
    timestamp: new Date().toISOString()
  })
);
