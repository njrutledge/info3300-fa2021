import {folder, LevaPanel, levaStore, useControls, useCreateStore} from "leva";
import {AAppState} from 'src/anigraph';
import {useEffect, useState} from "react";

// let appState = AAppState.GetAppState();
// @ts-ignore
function RenewStore({ controlSpecs, setStore }) {
  const store = useCreateStore();
  useEffect(() => {
    setStore(store);
  }, [setStore, store]);
  useControls(controlSpecs, { store });
  return <></>;
}
// @ts-ignore
export default function ControlPanel({ modelControlSpecs }) {
    // @ts-ignore
    let standardControls = AAppState.GetAppState().getControlPanelStandardSpec();
    const [store, setStore] = useState(levaStore);

    return (
        <>
            <LevaPanel store={store} />
            <RenewStore
                key={AAppState.GetAppState()._guiKey}
                controlSpecs={{
                    ...standardControls,
                    ModelGUI: folder({
                        ...modelControlSpecs
                    })
                }}
                setStore={setStore}
            />
        </>
    );
}
//##################//--old--\\##################
//<editor-fold desc="old">
//</editor-fold>
//##################\\--old--//##################
