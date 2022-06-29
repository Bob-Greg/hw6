import {ChangeEvent, useState} from "react";

export type TextBoxProps = {
    defaultText:string
    text:string
    customCss:string
    onChange:(_:string) => string
}

export const TextBox = (props:TextBoxProps) => {

    function change(ev:ChangeEvent<HTMLInputElement>) {
        props.onChange(ev.target.value)
    }

    return (
        <div>
            <input
                type="number"
                value={props.text}
                onChange={change}
                onFocus={event => event.currentTarget.select()}
                className={`${props.customCss}`}
            />
        </div>
    )
}