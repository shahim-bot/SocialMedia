import React from 'react'
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

export default function MyButton({ children, buttonClass, onClickFunction, toolTipClass, toolTipTitle}) {
    return (
        <Tooltip 
            title={toolTipTitle} 
            className={toolTipClass} 
            placement="top"
        >
            <IconButton
                onClick={onClickFunction}
                className={buttonClass}
            >
                {children}
            </IconButton>
        </Tooltip> 
    );
}
