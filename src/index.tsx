import "./style.css";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/_404";
import { Route, Router } from "preact-router";
import { hydrate, prerender as ssr } from "preact-iso";

export const App = () => (
  <main>
    <Router>
      <Route path="/" component={Home} />
      <Route path="/404" component={NotFound} />
    </Router>
  </main>
);

if (typeof window !== "undefined") {
  hydrate(<App />, document.querySelector("#app")!);
}

export const prerender = async (data: any) => await ssr(<App {...data} />);
