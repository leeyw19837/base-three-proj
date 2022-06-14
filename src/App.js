import './App.css';
import styled from "styled-components";
import {ThreeLoaderColladaKinematics} from "./modules/ThreeLoaderColladaKinematics";
import {MiscControlsOrbit} from "./modules/MiscControlsOrbit";

function App() {
    return (
        <AppRootWrapper>
            <TitleWrapper>Three.js 的基础测试框架</TitleWrapper>
            <ThreeBaseWrapper>
                <MiscControlsOrbit />
            </ThreeBaseWrapper>
        </AppRootWrapper>
    );
}

export default App;

const AppRootWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  position: relative;
  background: #000;
`

const TitleWrapper = styled.div`
  width: 100%;
  text-align: center;
  color: aliceblue;
  border-bottom: #ddd 1px solid;
`

const ThreeBaseWrapper = styled.div`
  display: flex;
  height: 100%;
  flex: 1;
  width: 100%;
  justify-content: center;
  align-content: center;
  // border: #61dafb 1px solid;
  overflow: hidden;
`

