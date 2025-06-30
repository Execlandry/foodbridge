import React from "react";
import Hero from "./landing-page/hero";
import HeadlineCards from "./landing-page/headline-cards";
import Footer from "./landing-page/footer";
import About from "./landing-page/About";
import Works from "./landing-page/works";
import CTA from "./landing-page/cta"

function App() {
  return (
    <>
      <div className="">
        <div className="App">
          <Hero/>
          <HeadlineCards />
          <About />
          <Works />
          <CTA />
          <Footer />
        </div>
      </div>
    </>
  );
}

export default App;
