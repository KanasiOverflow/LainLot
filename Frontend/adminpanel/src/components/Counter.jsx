import React, { useState } from "react";
import GeneralButton from "./UI/button/GeneralButton";
import GeneralInput from "./UI/input/GeneralInput";

function Counter() {
    const increase = increaseUpdate();
    const descrease = decreaseUpdate();

    const [boolVal, setBoolVal] = useState(true);

    function increaseUpdate() {
        return () => setBoolVal(true);
    }

    function decreaseUpdate() {
        return () => setBoolVal(false);
    }

    return (
        <div>
            <div style={{
                display: "flex", 
                marginBottom: "10px",
                marginTop: "10px"
            }}>
                <GeneralButton onClick={increase}>+</GeneralButton>
                <GeneralButton onClick={descrease}>-</GeneralButton>
            </div>

            <hr />
            {boolVal
                ? <GeneralInput text="Hello" />
                : <h4>Just text</h4>
            }
            <hr />
        </div>
    );
}

export default Counter;