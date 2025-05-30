import React from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";

import { AppSidebarNav } from "./AppSidebarNav";

import { logo } from "src/assets/brand/logo";
import { sygnet } from "src/assets/brand/sygnet";

// sidebar nav config
import navigation from "../_nav";

const AppSidebar = () => {
  const dispatch = useDispatch();
  const unfoldable = useSelector((state) => state.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.sidebarShow);

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: "set", sidebarShow: visible });
      }}>
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand
          className="d-flex align-items-center justify-content-center"
          style={{
            padding: "1rem",
            textDecoration: "none",
          }}
          to="/">
          <h4
            style={{
              margin: 0,
              color: "#fff",
              fontWeight: "bold",
              fontSize: "1.25rem",
            }}>
            Cognify Admin
          </h4>
        </CSidebarBrand>

        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: "set", sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: "set", sidebarShow: false })}
        />
      </CSidebarFooter>
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
