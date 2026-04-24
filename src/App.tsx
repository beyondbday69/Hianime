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
import { Dubbed } from "@/src/pages/Dubbed";
import { DubbedSearch } from "@/src/pages/DubbedSearch";
import { DubbedAnimeDetails } from "@/src/pages/DubbedAnimeDetails";
import { DubbedWatch } from "@/src/pages/DubbedWatch";
import { ProviderContextProvider } from "@/src/contexts/ProviderContext";

export default function App() {
  return (
    <ProviderContextProvider>
      <SmoothScroll>
        <div className="min-h-screen relative">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/tv" component={TvSeries} />
            <Route path="/anime/:id" component={AnimeDetails} />
            <Route path="/watch/:animeId/:epId" component={Watch} />
            <Route path="/search/:query" component={Search} />
            <Route path="/api-info" component={ApiInfo} />

            {/* Dubbed Routes */}
            <Route path="/dubbed" component={Dubbed} />
            <Route path="/dubbed/search/:query" component={DubbedSearch} />
            <Route path="/dubbed/anime/:slug" component={DubbedAnimeDetails} />
            <Route path="/dubbed/watch/:slug/:id" component={DubbedWatch} />

            {/* Fallback route */}
            <Route>
              <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-headline-l">PAGE NOT FOUND</h1>
              </div>
            </Route>
          </Switch>

          {/* Global Warning Banner */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#ff3333] text-white text-center py-2 px-4 text-sm font-medium shadow-[0_-4px_10px_rgba(0,0,0,0.3)]">
            Please stay on the page. The video is taking a little time to load. We apologize for the inconvenience — video server maintenance is currently in progress.
          </div>
        </div>
      </SmoothScroll>
    </ProviderContextProvider>
  );
}
