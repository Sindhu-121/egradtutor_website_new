import React, { useState, useEffect, useContext } from "react";
import { LiaEditSolid } from "react-icons/lia";
import { CiEdit } from "react-icons/ci";
import axios from "axios";
import BASE_URL from "../../../apiConfig";
import { MdDelete } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
 
const FooterEdit = ({ type }) => {
    const [dataOne, setDataOne] = useState([]);
    const [editItemIdOne, setEditedItemIdOne] = useState(null);
    const [editedItemOne, setEditedItemOne] = useState({
        content: "",
    });
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        Link_Item: "",
        Link_Routing_Data: "",
    });
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [documentName, setDocumentName] = useState("");
    const [footerLinkData, setFooterLinkData] = useState([]);
    const [editFooterItemId, setEditFooterItemId] = useState(null);
    const [editedLinkItem, setEditedLinkItem] = useState("");
    const handleChangeLinkItem = (e) => setEditedLinkItem(e.target.value);
    const [editedLinkRoutingData, setEditedLinkRoutingData] = useState("");
    const [currentDocumentName, setCurrentDocumentName] = useState('');
    const [editLinkFileData, setEditLinkFileData] = useState("");
    const [dataTwo, setDataTwo] = useState([]);
 
    const [editItemId, setEditItemId] = useState(null);
    const [editedItem, setEditedItem] = useState(null);
    const [dataThree, setDataThree] = useState([]);
    const [editItemIdThree, setEditItemIdThree] = useState(null);
    const [editedItemThree, setEditedItemThree] = useState({
        content_name: "",
    });
    const [editedValue, setEditedValue] = useState("");
    const [isPopupOpen, setIsPopupOpen] = useState(false);
 
 
 
    const handleEditClickPopupOne = (content_id, content) => {
        setEditedItemIdOne(content_id);
        setEditedItemOne({ content: content });
    };
 
    const handleDeleteItemOne = async (content_id) => {
        try {
            console.log("Deleting item with ID:", content_id);
            const response = await axios.delete(
                `${BASE_URL}/FooterEdit/landingfooterContentDataOne/${content_id}`
            );
 
            console.log("Success:", response.data);
            console.log("Item deleted");
 
            setDataOne((prevData) =>
                prevData.filter((dataItem) => dataItem.Content_id !== content_id)
            );
        } catch (error) {
            console.error("Error deleting data:", error);
        }
    };
    const handleExistingValueChangeOne = (e) => {
        const newValue = e.target.value;
        setEditedItemOne({ content: newValue });
    };
 
    const handleEditSaveOne = async (content_id, editedContent, setDataOne) => {
        console.log(content_id);
        console.log(editedContent);
        try {
            const response = await axios.put(
                `${BASE_URL}/FooterEdit/landingfooterContentDataTwoUpdate/${content_id}`,
                { content_name: editedContent } // Ensure the correct field name is sent to the backend
            );
 
            console.log("Data updated successfully:", response.data);
 
            setDataOne((prevData) =>
                prevData.map((item) =>
                    item.content_id === content_id
                        ? {
                            ...item,
                            content: editedContent,
                        }
                        : item
                )
            );
 
            setEditedItemIdOne(null);
        } catch (error) {
            console.error("Error updating data:", error);
        }
    };
 
    useEffect(() => {
        axios
            .get(`${BASE_URL}/Footer/landingfooterContentDataOne`)
            .then((res) => {
                setDataOne(res.data);
            })
            .catch((error) => {
                console.error("Error fetching data from landing_page_one:", error);
            });
    }, []);
 
    //Footer first part eGRADTtorData End //
 
    const handleSubmitFooterLinks = async (e) => {
        e.preventDefault();
        try {
            const formDataWithFile = new FormData();
            if (file) {
                formDataWithFile.append("file", file);
                formDataWithFile.append("document_name", file.name);
            }
            formDataWithFile.append("Link_Item", formData.Link_Item);
            formDataWithFile.append("Link_Routing_Data", formData.Link_Routing_Data);
 
            const response = await axios.post(
                `${BASE_URL}/FooterEdit/footerLinks`,
                formDataWithFile,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log("Response:", response.data);
 
            // Show success message
            setShowSuccessMessage(true);
 
            // Reset form state or do any additional actions
        } catch (error) {
            console.error("Error submitting data:", error);
            // Handle error if needed
        }
    };
 
 
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
 
    const handleEditFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        // Extract only the filename from the path
        const fileName = event.target.value.split('\\').pop().split('/').pop(); // Handles both Windows and Unix paths
        // setDocumentName(fileName); // Set the document name to display
        setDocumentName(file ? file.name : '');
    };
 
 
    useEffect(() => {
        fetchFooterLinks();
    }, []);
 
    const fetchFooterLinks = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/Footer/footerLinks`);
            setFooterLinkData(response.data);
        } catch (error) {
            console.error("Error fetching footer links:", error);
        }
    };
 
    const handleChangeLinkRoutingData = (e) =>
        setEditedLinkRoutingData(e.target.value);
 
    const handleSaveFooterItem = async (Link_Id) => {
        console.log("document_name", documentName);
        const formData = new FormData();
        formData.append("Link_Item", editedLinkItem);
        formData.append("Link_Routing_Data", editedLinkRoutingData);
        formData.append("document_name", documentName);
        if (selectedFile) {
            formData.append("file", selectedFile);
        }
 
        try {
            const response = await axios.put(
                `${BASE_URL}/FooterEdit/footerLinks/${Link_Id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log("Response:", response.data);
 
            // Reset edit state
            setEditFooterItemId(null);
            setEditedLinkItem("");
            setEditedLinkRoutingData("");
            setSelectedFile(null);
            setDocumentName("");
            setCurrentDocumentName(''); // Clear current document name display if needed
        } catch (error) {
            console.error("Error updating data:", error);
        }
    };
    const handleEditFooterItemClick = (
        Link_Id,
        Link_Item,
        Link_Routing_Data,
        footer_document_data,
        document_name
    ) => {
        console.log(documentName);
        setEditFooterItemId(Link_Id);
        setEditedLinkItem(Link_Item);
        setEditedLinkRoutingData(Link_Routing_Data);
        setEditLinkFileData(footer_document_data);
        setDocumentName(document_name);
    };
 
    const handleDeleteFooterItem = async (Link_Id) => {
        console.log("Link_Id", Link_Id);
        try {
            const response = await axios.delete(
                `${BASE_URL}/FooterEdit/footerLinksDeleteData/${Link_Id}`
            );
            console.log("Response:", response.data);
        } catch (error) {
            console.error("Error deleting data:", error);
        }
    };
 
    useEffect(() => {
        const fetchFooterData = async () => {
            try {
                const response = await axios.get(
                    `${BASE_URL}/Footer/landingfooterContentDataTwo`
                );
                setDataTwo(response.data);
            } catch (error) {
                console.error("Error fetching data from landing_page_two:", error);
            }
        };
 
        fetchFooterData();
    }, []);
 
    const handleEditClickPopup = (id) => {
        setEditItemId(id);
        // Find the item associated with the editItemId and store it in state
        const itemToEdit = dataTwo.find((item) => item.Content_id === id);
        setEditedItem(itemToEdit);
    };
 
    const handleDeleteItemTwo = async (content_id) => {
        try {
            console.log("Deleting item with ID:", content_id);
            await axios.delete(
                `${BASE_URL}/FooterPage/landingfooterContentDataTwo/${content_id}`
            );
            console.log("Item deleted");
            setDataTwo((prevData) =>
                prevData.filter((dataItem) => dataItem.content_id !== content_id)
            );
        } catch (error) {
            console.error("Error deleting data:", error);
        }
    };
    const handleExistingValueChange = (e) => {
        setEditedItem({ ...editedItem, content_name: e.target.value });
    };
 
    const handleEditSave = async (content_id, editedContent, setDataTwo) => {
        try {
            const response = await axios.put(
                `${BASE_URL}/FooterPage/landingfooterContentDataOneUpdate/${content_id}`,
                { content_name: editedContent }
            );
 
            console.log("Data updated successfully:", response.data);
 
            setDataTwo((prevData) =>
                prevData.map((item) =>
                    item.Content_id === content_id
                        ? {
                            ...item,
                            content_name: editedContent,
                        }
                        : item
                )
            );
        } catch (error) {
            console.error("Error updating data:", error);
        }
    };
    const handleEditClickPopupThree = (content_id, content_name) => {
        setEditItemIdThree(content_id);
        setEditedItemThree({ content_name });
        setIsPopupOpen(true);
        setEditedValue(content_name); // Set the initial value of the input field
    };
    const handleDeleteItemThree = async (content_id) => {
        try {
            console.log("Deleting item with ID:", content_id);
            const response = await axios.delete(
                `${BASE_URL}/FooterPage/landingfooterContentDataThree/${content_id}`
            );
 
            console.log("Success:", response.data);
            console.log("Item deleted");
 
            setDataThree((prevData) =>
                prevData.filter((dataItem) => dataItem.Content_id !== content_id)
            );
        } catch (error) {
            console.error("Error deleting data:", error);
        }
    };
    const handleInputChange = (e) => {
        // Update the edited value as the user types
        setEditedValue(e.target.value);
    };
    const handleSave = () => {
        // Implement logic to save the edited value
        handleEditSaveThree(editItemIdThree, editedValue); // Assuming handleEditSaveThree updates the dataThree state
        setIsPopupOpen(false); // Close the popup
    };
 
    const handleEditSaveThree = async (
        content_id,
        editedContent,
        setDataThree
    ) => {
        try {
            const response = await axios.put(
                `${BASE_URL}/FooterPage/landingfooterContentDataThreeUpdate/${content_id}`,
                { content_name: editedContent }
            );
 
            console.log("Data updated successfully:", response.data);
 
            setDataThree((prevData) =>
                prevData.map((item) =>
                    item.content_id === content_id
                        ? {
                            ...item,
                            content_name: editedContent,
                        }
                        : item
                )
            );
 
            setEditItemIdThree(null);
        } catch (error) {
            console.error("Error updating data:", error);
        }
    };
 
    useEffect(() => {
        const fetchFooterCopyWriteData = async () => {
            try {
                const response = await axios.get(
                    `${BASE_URL}/Footer/landingfooterContentDataThree`
                );
                setDataThree(response.data);
            } catch (error) {
                console.error("Error fetching data from landing_copyright:", error);
            }
        };
        fetchFooterCopyWriteData();
    }, []);
    return (
        <div>
            {type === "eGARDTutor" && (
                <div className="new_landingfooter_conatinerfristpopup">
                    {dataOne.map((item) => (
                        <li key={item.content_id}>
                            {item.content}
                            <div className="new_landingfooter_conatinerfristpopupbtncontiner">
                                <button onClick={() => handleEditClickPopupOne(item.content_id, item.content)}>
                                    <CiEdit />
                                </button>
                                <button onClick={() => handleDeleteItemOne(item.content_id)}>
                                    <MdDelete />
                                </button>
                            </div>
                        </li>
                    ))}
                    {editItemIdOne && editedItemOne && (
                        <div className="new_landingfooter_conatinerfristpopupsubpart">
                            <h3>Edit</h3>
                            <input
                                type="text"
                                value={editedItemOne.content}
                                onChange={handleExistingValueChangeOne}
                            />
                            <div className="new_landingfooter_conatinerfristpopupbtncontiner">
                                <button onClick={() => handleEditSaveOne(editItemIdOne, editedItemOne.content, setDataOne)}>
                                    Save
                                </button>
                                <button onClick={() => setEditedItemIdOne(null)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {type === "Add_Footer_Links" && (
                <div className="new_landingfooter_conatinersecondpopup">
                    <h3>Add Footer Links</h3>
                    <form onSubmit={handleSubmitFooterLinks}>
                        <li>
                            <label>Link Name:</label>
                            <input
                                type="text"
                                name="Link_Item"
                                value={formData.Link_Item}
                                onChange={handleChange}
                                required
                            />
                        </li>
                        <li>
                            <label>Routing Path Data:</label>
                            <input
                                type="text"
                                name="Link_Routing_Data"
                                value={formData.Link_Routing_Data}
                                onChange={handleChange}
                                required
                            />
                        </li>
                        <li>
                            <label>Upload File:</label>
                            <input type="file" onChange={handleEditFileChange} />
                            {/* <button onClick={handleFileUpload}>Upload</button> */}
                        </li>
                        <div className="new_landingfooter_conatinerfristpopupbtncontiner">
                            <button type="submit">Submit</button>
                        </div>
                    </form>
                </div>
            )}
            {showSuccessMessage && (
                <div className="success-message">Data uploaded successfully!</div>
            )}
            {type === "Update_Footer_Links" && (
                <div className="new_landingfooter_conatinersecondpopup_links">
                    <ul>
                        {footerLinkData.map((item) => (
                            <li key={item.Link_Id}>
                                {editFooterItemId === item.Link_Id ? (
                                    <>
                                        <div className="edittwoinputinlinkscontiner">
                                            <h1>update</h1>
                                            <input
                                                type="text"
                                                value={editedLinkItem}
                                                onChange={handleChangeLinkItem}
                                                required
                                            />
                                            <input
                                                type="text"
                                                value={editedLinkRoutingData}
                                                onChange={handleChangeLinkRoutingData}
                                                required
                                            />
                                            <label>Upload File:</label>
                                            <input
                                                type="file"
                                                onChange={handleEditFileChange}
                                            />
                                            <p style={{ color: "black" }}>
                                                {selectedFile ? documentName : item.document_name}
                                            </p>
                                            <div className="edittwoinputinlinksbtncontiner">
                                                <button onClick={() => handleSaveFooterItem(item.Link_Id)}>
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Link to={item.Link_Routing_Data} style={{ color: "black" }}>
                                            {item.Link_Item}
                                        </Link>
                                        <div className="new_landingfooter_conatinersecondpopup_linksbtncontiner">
                                            <button onClick={() => handleEditFooterItemClick(item.Link_Id, item.Link_Item, item.Link_Routing_Data, item.document_name)}>
                                                <CiEdit />
                                            </button>
                                            <button onClick={() => handleDeleteFooterItem(item.Link_Id)}>
                                                <RiDeleteBin6Line />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {type === "ContactUs" && (
                <div className="new_landingfooter_conatinerthridpopup">
                    {dataTwo.map((item) => (
                        <li key={item.Content_id} className="black-text">
                            {item.content_name}{" "}
                            <div className="new_landingfooter_conatinerthridpopupbtncontiner">
                                <button>
                                    <CiEdit
                                        onClick={() =>
                                            handleEditClickPopup(item.Content_id)
                                        }
                                    />{" "}
                                </button>
                                <button>
                                    <MdDelete
                                        onClick={() => handleDeleteItemTwo(item.Content_id)}
                                    />
                                </button>
                            </div>
                        </li>
                    ))}
 
                    {editItemId && editedItem && (
                        <div className="new_landingfooter_conatinerthridpopupsub">
                            <h3>Edit</h3>
                            <li>
                                <input
                                    type="text"
                                    value={editedItem.content_name}
                                    onChange={handleExistingValueChange}
                                />
                            </li>
                            <div className="new_landingfooter_conatinerthridpopupbtncontiner">
                                <button
                                    onClick={() =>
                                        handleEditSave(
                                            editItemId,
                                            editedItem.content_name,
                                            setDataTwo
                                        )
                                    }
                                >
                                    Save
                                </button>
                                <button onClick={() => setEditItemId(null)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
 
            {type === "CopyWriteTable" && (
                <div className="new_landingfooter_copyrightpopup">
                    {dataThree.map((item) => (
                        <li key={item.content_id} className="black-text">
                            {item.content_name}{" "}
                            <div className="new_landingfooter_copyrightpopupbtncontainer">
                                <button>
                                    <CiEdit
                                        onClick={() =>
                                            handleEditClickPopupThree(item.content_id, item.content_name)
                                        }
                                    />
                                </button>
                                <button>
                                    {" "}
                                    <MdDelete
                                        onClick={() => handleDeleteItemThree(item.content_id)}
                                    />
                                </button>
                            </div>
                        </li>
                    ))}
                    {isPopupOpen && (
                        <div className="new_landingfooter_copyrightpopupsub">
                            <input
                                type="text"
                                value={editedValue}
                                onChange={handleInputChange}
                            />
                            <div className="new_landingfooter_copyrightpopupsubbtnconatiner">
                                <button onClick={handleSave}>Save</button>
                                <button onClick={() => setIsPopupOpen(false)}>Cancel</button>
                            </div>
                        </div>
                    )}
 
                </div>
            )}
        </div>
    )
}
 
export default FooterEdit