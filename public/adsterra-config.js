/**
 * InfiTik Adsterra configuration.
 *
 * Leave enabled as false until Adsterra has approved the website and generated
 * both ad codes. The exact script URLs and Native Banner container ID can then
 * be copied from those generated codes without changing the website layout.
 */
window.INFITIK_ADS = Object.freeze({
  enabled: false,
  nativeBanner: Object.freeze({
    scriptSrc: "",
    containerId: ""
  }),
  socialBar: Object.freeze({
    scriptSrc: ""
  })
});
