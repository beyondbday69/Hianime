/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Route, Switch } from "wouter";
import { Home } from "@/src/pages/Home";
import { TvSeries } from "@/src/pages/TvSeries";
import { AnimeDetails } from "@/src/pages/AnimeDetails";
import { Search } from "@/src/pages/Search";
import { Watch } from "@/src/pages/Watch";
import { ApiInfo } from "@/src/pages/ApiInfo";
import { SmoothScroll } from "@/src/components/layout/SmoothScroll";

export default function App() {
  return (
    <SmoothScroll>
      <div className="min-h-screen relative">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/tv" component={TvSeries} />
          <Route path="/anime/:id" component={AnimeDetails} />
          <Route path="/watch/:animeId/:epId" component={Watch} />
          <Route path="/search/:query" component={Search} />
          <Route path="/api-info" component={ApiInfo} />
          {/* Fallback route */}
          <Route>
            <div className="min-h-screen flex items-center justify-center">
              <h1 className="text-headline-l">PAGE NOT FOUND</h1>
            </div>
          </Route>
        </Switch>
      </div>
    </SmoothScroll>
  );
}
