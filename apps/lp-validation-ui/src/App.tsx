import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PositionManagement from "./pages/PositionManagement";
import PositionDetail from "./pages/PositionDetail";
import EventDetail from "./pages/EventDetail";
import "./App.css";
const queryClient = new QueryClient();
const App = ()=>(<QueryClientProvider client={queryClient} data-spec-id="C0Vs8kYteACjEaYS">
    <TooltipProvider data-spec-id="rvvmnJKBjor9eggf">
      <Toaster data-spec-id="ksiezaVScbu8WER1"/>
      <BrowserRouter data-spec-id="KN19wmP7OdaqEp0V">
        <Routes data-spec-id="5HwiuQpXjcUTbI34">
          <Route path="/specai-page/Index" element={<Index data-spec-id="sEcYZaNYDdHPeA7k"/>} data-spec-id="SDp9YATv6v9i01rs"/>
          <Route path="/specai-page/NotFound" element={<NotFound data-spec-id="DX7AlccrGODqpopT"/>} data-spec-id="f4SvJQAtKc07MirH"/>

          <Route path="/" element={<Index data-dora-id="1" data-spec-id="tt2BB3QVEz9ES9Cm"/>} data-spec-id="kZ2ebgQnbJDW8UrG"/>
          <Route path="/position-management" element={<PositionManagement data-spec-id="position-mgmt-route"/>} data-spec-id="position-mgmt-path"/>
          <Route path="/position/:id" element={<PositionDetail data-spec-id="position-detail-route"/>} data-spec-id="position-detail-path"/>
          <Route path="/event/:id" element={<EventDetail data-spec-id="event-detail-route"/>} data-spec-id="event-detail-path"/>
          {}
          <Route path="*" element={<NotFound data-spec-id="bj6ubRzJ7OTAasON"/>} data-spec-id="c1aDSqa9VNPxlWhM"/>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>);
export default App;
