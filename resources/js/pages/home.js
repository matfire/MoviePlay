import { timeline, inView, animate } from "motion"
const draw = (progress) => ({
  strokeDashoffset: 1 - progress,
  visibility: "visible"
})

document.querySelectorAll("section").forEach(el => {
  el.style.opacity = 0;
})

inView("section", (element) => {
  animate(
    element.target,
    {
      opacity: 100
    },
    {
      delay: 0.3
    }
  )
})
