import { timeline, inView, stagger } from "motion"

document.querySelectorAll("section").forEach(el => {
  el.style.opacity = 0;
})
document.querySelectorAll(".feature").forEach((el) => {
  el.style.opacity = 0
})
document.querySelector("#tmdb-logo").style.opacity = 0

inView("section", (element) => {
  timeline([
    [element.target, { opacity: 100 }, { delay: 0.3 }],
    [element.target.querySelectorAll(".feature"), { opacity: 100, x: [-100, 0] }, { delay: stagger(0.3), duration: 0.8 }],
    [element.target.querySelector("#tmdb-logo"), { opacity: 100, y: [-100, 0] }, { delay: 0.3, duration: 0.5 }]
  ])
})
