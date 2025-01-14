import React, { forwardRef, useCallback } from "react";

export const Dropdown = forwardRef<
  HTMLSelectElement,
  {
    styles: React.CSSProperties;
    custom: {
      selectedValue?: string;
      dropdownItems: { displayed: string; value: string }[];
      disabled?: boolean;
    };
    onChange: (selectedValue: string) => void;
    className?: string;
  }
>((props, ref) => {
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      props.onChange(e.target.value);
    },
    [props]
  );
  return (
    <select
      value={props.custom.selectedValue}
      onChange={onChange}
      disabled={props.custom.disabled}
      className={props.className}
      style={props.styles}
      ref={ref}
    >
      {props.custom.dropdownItems.map((dropdownItem, index) => {
        return (
          <option value={dropdownItem.value} key={index}>
            {dropdownItem.displayed || dropdownItem.value}
          </option>
        );
      })}
    </select>
  );
});

export default Dropdown;
