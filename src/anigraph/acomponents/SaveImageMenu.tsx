import {Button, Menu, MenuButton, MenuItem, MenuList} from "@chakra-ui/react";
import {IoIosArrowDown} from "react-icons/io";
import {AAppState} from "src/anigraph/index";
import React from "react";

// let appState = GetAppState();

function openNav() {
    if(!document){
        return;
    }
    let sidebar = document.getElementById("mySidebar");
    if(sidebar) {
        sidebar.style.width = "250px";
    }
    let maindiv = document.getElementById("main");
    if(maindiv){
        maindiv.style.marginLeft = "250px";
    }
}

export function SaveImageMenu() {
    return (
        <>
            <Menu>
                <MenuButton as={Button} rightIcon={<IoIosArrowDown />} m={4}>
                    Menu
                </MenuButton>
                <MenuList>
                    <MenuItem
                        onClick={() => {
                            // console.log("CLICKED!")
                            for(let s in AAppState.GetAppState().sceneControllers){
                                AAppState.GetAppState().sceneControllers[s].view.recordNextFrame();
                                console.log(s);
                            }
                        }}
                    >
                        Save Contexts to PNG
                    </MenuItem>
                    <MenuItem
                        onClick={openNav}
                        >
                        Show SceneGraph
                    </MenuItem>
                </MenuList>
            </Menu>
        </>
    );
}
