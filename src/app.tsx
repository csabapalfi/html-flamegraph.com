import React, { Component, FormEvent, lazy, Suspense } from "react";
const FlameGraph = lazy(() => import("./components/flame-graph"));

import { RawData } from "react-flame-graph";
import { Error } from "./components/error";
import Loading from "./components/loading";
import { Nav } from "./components/nav";

interface Props {}

interface State {
  rawHtml: string;
  data: RawData;
  loading: boolean;
  error: string | null;
}

export class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      rawHtml: `<html>
            <body>
              <p>Text</p>
              <script>console.log('test');</script>
            </body>
          </html>
        `.replace(/ /g, ""),
      data: null,
      loading: false,
      error: null,
    };
  }

  handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    const { rawHtml } = this.state;
    e.preventDefault();
    this.setState({ data: null, error: null, loading: true });
    try {
      const { parseHtml } = await import("./parser");
      const data = await parseHtml(rawHtml);
      return this.setState({ data, loading: false });
    } catch (e) {
      console.error(e);
      return this.setState({
        loading: false,
        error: "Oops, failed to generate your graph.",
      });
    }
  };

  render() {
    const { data, rawHtml, loading, error } = this.state;
    return (
      <div className="App">
        <Nav
          html={rawHtml}
          onChange={(e) => this.setState({ rawHtml: e.target.value })}
          onSubmit={this.handleSubmit}
        />
        <main>
          {error && <Error />}
          {loading && <Loading />}
          <Suspense fallback={<Loading />}>
            {data && <FlameGraph data={data} />}
          </Suspense>
        </main>
      </div>
    );
  }
}
