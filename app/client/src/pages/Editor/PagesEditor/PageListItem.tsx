import { get } from "lodash";
import { useDispatch } from "react-redux";
import styled, { useTheme } from "styled-components";
import React, { useCallback } from "react";

import {
  updatePage,
  clonePageInit,
  deletePage,
  setPageAsDefault,
} from "actions/pageActions";
import EditName from "./EditName";
import ContextMenu from "./ContextMenu";
import { FormIcons } from "icons/FormIcons";
import { ControlIcons } from "icons/ControlIcons";

import { Page } from "constants/ReduxActionConstants";
import AnalyticsUtil from "utils/AnalyticsUtil";
import { Colors } from "constants/Colors";
import { MenuIcons } from "icons/MenuIcons";
import TooltipComponent from "components/ads/Tooltip";
import {
  CLONE_TOOLTIP,
  createMessage,
  DEFAULT_PAGE_TOOLTIP,
  DELETE_TOOLTIP,
  HIDDEN_TOOLTIP,
} from "constants/messages";
import { TOOLTIP_HOVER_ON_DELAY } from "constants/AppConstants";
import { Position } from "@blueprintjs/core";

export const Container = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  cursor: grab;

  &:focus,
  &:active {
    cursor: grabbing;
  }
`;

export const ListItem = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  padding: 10px;
  background-color: ${Colors.GREY_1};
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
`;

export const Action = styled.button`
  cursor: pointer;
  height: 28px;
  width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  border: none;
  background: transparent;
  margin-left: 4px;

  &:focus {
    outline: none;
  }
`;

const DefaultPageIcon = MenuIcons.DEFAULT_HOMEPAGE_ICON;
const DeleteIcon = FormIcons.DELETE_ICON;
const CopyIcon = ControlIcons.COPY_CONTROL;
const DragIcon = ControlIcons.DRAG_CONTROL;
const HideIcon = ControlIcons.HIDE_COLUMN;

export interface PageListItemProps {
  item: Page;
  applicationId: string;
}

function PageListItem(props: PageListItemProps) {
  const theme = useTheme();
  const { applicationId, item } = props;
  const dispatch = useDispatch();

  /**
   * clones the page
   *
   * @return void
   */
  const clonePageCallback = useCallback((): void => {
    dispatch(clonePageInit(item.pageId, true));
  }, [dispatch]);

  /**
   * delete the page
   *
   * @return void
   */
  const deletePageCallback = useCallback((): void => {
    dispatch(deletePage(item.pageId));

    AnalyticsUtil.logEvent("DELETE_PAGE", {
      pageName: item.pageName,
    });
  }, [dispatch]);

  /**
   * sets the page as default
   *
   * @return void
   */
  const setPageAsDefaultCallback = useCallback((): void => {
    dispatch(setPageAsDefault(item.pageId, props.applicationId));
  }, [dispatch]);

  /**
   * sets the page hidden
   *
   * @return void
   */
  const setPageHidden = useCallback(() => {
    return dispatch(updatePage(item.pageId, item.pageName, !item.isHidden));
  }, [dispatch]);

  return (
    <Container>
      <ListItem>
        <DragIcon
          color={get(theme, "colors.pagesEditor.iconColor")}
          cursor="move"
          height={20}
          width={20}
        />
        <EditName applicationId={applicationId} page={item} />
        <Actions>
          {item.isDefault && (
            <TooltipComponent
              content={createMessage(DEFAULT_PAGE_TOOLTIP)}
              hoverOpenDelay={TOOLTIP_HOVER_ON_DELAY}
              position={Position.BOTTOM}
            >
              <Action>
                <DefaultPageIcon color={Colors.GREEN} height={16} width={16} />
              </Action>
            </TooltipComponent>
          )}
          {item.isHidden && (
            <TooltipComponent
              content={createMessage(HIDDEN_TOOLTIP)}
              hoverOpenDelay={TOOLTIP_HOVER_ON_DELAY}
              position={Position.BOTTOM}
            >
              <Action>
                <HideIcon color={Colors.GREY_9} height={16} width={16} />
              </Action>
            </TooltipComponent>
          )}
          <ContextMenu
            applicationId={applicationId}
            onCopy={clonePageCallback}
            onDelete={deletePageCallback}
            onSetPageDefault={setPageAsDefaultCallback}
            onSetPageHidden={setPageHidden}
            page={item}
          />
          <TooltipComponent
            content={createMessage(CLONE_TOOLTIP)}
            hoverOpenDelay={TOOLTIP_HOVER_ON_DELAY}
            position={Position.BOTTOM}
          >
            <Action type="button">
              <CopyIcon
                color={Colors.GREY_9}
                height={16}
                onClick={clonePageCallback}
                width={16}
              />
            </Action>
          </TooltipComponent>
          <TooltipComponent
            content={createMessage(DELETE_TOOLTIP)}
            hoverOpenDelay={TOOLTIP_HOVER_ON_DELAY}
            position={Position.BOTTOM}
          >
            <Action type="button">
              <DeleteIcon
                color={
                  item.isDefault
                    ? get(theme, "colors.propertyPane.deleteIconColor")
                    : Colors.GREY_9
                }
                disabled={item.isDefault}
                height={16}
                onClick={deletePageCallback}
                width={16}
              />
            </Action>
          </TooltipComponent>
        </Actions>
      </ListItem>
    </Container>
  );
}
export default PageListItem;
