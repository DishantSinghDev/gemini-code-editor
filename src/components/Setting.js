import { Dispatch, SetStateAction, useState } from "react";
import Modal from "./shared/modal";
import BarIcon from "./shared/icons/animatedBar";


export const SettingModal = ({
    showSettingModal,
    setShowSettingModal,
}) => {
    
    const RowData = [
        {
            name: "Gemini API Key",
            info: "This is your API Key",
            button: <button className="text-sm text-blue-500">Copy</button>
        },
        {
            name: "Gemini Memory",
            info: "This is your Gemini Memory",
            button: <button className="text-sm text-blue-500">Copy</button>
        },
        {
            name: "Google Drive Folder",
            info: "This is your Google Drive Folder",
            button: <button className="text-sm text-blue-500">Copy</button>
        }
    ];

    return (
        <Modal showModal={showSettingModal} setShowModal={setShowSettingModal}>
            <div className="overflow-hidden w-full shadow-xl md:max-w-lg md:rounded-2xl md:border md:border-gray-200">
                <div className="flex flex-col justify-center items-center px-4 py-6 pt-8 space-y-3 text-center bg-white border-b border-gray-200 md:px-10">
                    <h3 className="text-2xl font-bold font-display">Setting</h3>
                    <p className="text-sm text-gray-500">
                        This is used to access Gemini Memory and Keys.
                    </p>
                    <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                        <tbody>
                            {RowData.map((data, index) => (
                                <tr key={index} class="odd:bg-white  even:bg-gray-50 border-b ">
                                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                        {data.name}
                                    </th>
                                    <td class="px-6 py-4">
                                        {data.info}
                                    </td>
                                    <td class="px-6 py-4">
                                        {data.button}
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </div>
        </Modal>
    )
}