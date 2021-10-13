import React from "react";
import styled from "styled-components";
import { Setting, SettingTypes } from "../SettingsConfig";
import { StyledLabel } from "./Common";
import Link from "./Link";
import TextInput from "./TextInput";
import Toggle from "./Toggle";
import Text from "./Text";
import Button from "./Button";
import { getFormValues } from "redux-form";
import { SETTINGS_FORM_NAME } from "constants/forms";
import { useSelector } from "store";

type GroupProps = {
  name?: string;
  settings?: Setting[];
  isHidden?: boolean;
};

const GroupWrapper = styled.div`
  position: relative;
  z-index: 1;
  &.hide {
    display: none;
  }
`;

const GroupHeader = styled(StyledLabel)`
  text-transform: capitalize;
  margin-bottom: ${(props) => props.theme.spaces[9]}px;
  font-size: 20px;
  font-weight: 500;
`;

const GroupBody = styled.div`
  & .hide {
    display: none;
  }
`;

const formValuesSelector = getFormValues(SETTINGS_FORM_NAME);

export default function Group({ name, settings }: GroupProps) {
  const state = useSelector((state) => state);
  return (
    <GroupWrapper>
      <GroupHeader>{name}</GroupHeader>
      <GroupBody>
        {settings &&
          settings.map((setting) => {
            if (
              setting.isVisible &&
              !setting.isVisible(formValuesSelector(state))
            ) {
              return null;
            }
            switch (setting.controlType) {
              case SettingTypes.TEXTINPUT:
                return (
                  <div className={setting.isHidden ? "hide" : ""}>
                    <TextInput key={setting.name} setting={setting} />
                  </div>
                );
              case SettingTypes.TOGGLE:
                return (
                  <div className={setting.isHidden ? "hide" : ""}>
                    <Toggle key={setting.name} setting={setting} />
                  </div>
                );
              case SettingTypes.LINK:
                return (
                  <div className={setting.isHidden ? "hide" : ""}>
                    <Link key={setting.name} setting={setting} />
                  </div>
                );
              case SettingTypes.TEXT:
                return (
                  <div className={setting.isHidden ? "hide" : ""}>
                    <Text key={setting.name} setting={setting} />
                  </div>
                );
              case SettingTypes.BUTTON:
                return (
                  <div className={setting.isHidden ? "hide" : ""}>
                    <Button key={setting.name} setting={setting} />
                  </div>
                );
              case SettingTypes.GROUP:
                return (
                  <div className={setting.isHidden ? "hide" : ""}>
                    <Group
                      key={setting.name}
                      name={setting.name}
                      settings={setting.children}
                    />
                  </div>
                );
            }
          })}
      </GroupBody>
    </GroupWrapper>
  );
}