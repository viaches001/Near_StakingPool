import React, {useEffect} from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from './Layout';
import Dashboard from './Pages/Dashboard'
import MyPage from './Pages/MyPage'
import Earn from './Pages/Earn'
import Utility from './Pages/Utility'
import CommunityFarm from './Pages/CommunityFarm';
import Terms from './Pages/Terms';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="mypage" element={<MyPage />} />
          <Route path="earn" element={<Earn />} />
          <Route path="utility" element={<Utility />} />
          <Route path="farm" element={<CommunityFarm />} />
          <Route path="terms" element={<Terms />} />
          <Route path="*" element={"404"} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
