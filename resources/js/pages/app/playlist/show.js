console.log("hello")
up.on("movie_added", () => {
  console.log("got event")
  up.reload()
})
