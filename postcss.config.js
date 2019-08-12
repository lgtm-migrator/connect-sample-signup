module.exports = {
  plugins: [
    require("postcss-custom-properties")({
      preserve: false
    }),
    require("autoprefixer"),
    require("cssnano")({
      preset: "default"
    })
  ]
};
