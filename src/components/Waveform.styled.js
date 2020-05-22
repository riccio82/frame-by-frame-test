import styled from 'styled-components';

export const WaveformContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100px;  width: 100%;
    background: transparent;
`;

export const Wave = styled.div`
    width: 90%;
    height: 150px;
`;

export const WaveButtons = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 100px;  width: 100%;
    background: transparent;
    margin-bottom: 50px;
`;

export const PlayButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 40px;
    background: #EFEFEF;
    border: none;
    outline: none;
    cursor: pointer;
    padding-bottom: 3px;
    margin: 10px;
        &:hover {
        background: #DDD;
      
        }
`;
