console.log("heelo")
up.on("movie_added", () => {
  console.log("got event")
  up.reload()
})
