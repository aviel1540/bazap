import { useEffect, useRef, useState } from "react";
import { Input, List, Typography, Tag, Card, Divider, Tooltip, Flex } from "antd";
import { useMutation } from "@tanstack/react-query";
import { searchDeviceBySerialNumber } from "../../../Utils/deviceApi";
import { tagColors } from "../../../Utils/utils";
import { DoubleLeftOutlined } from "@ant-design/icons";
import CustomButton from "../../UI/CustomButton/CustomButton";
import { useNavigate } from "react-router-dom";
import EmptyData from "../../UI/EmptyData";

const { Search } = Input;
const { Text } = Typography;

let timeoutId = null;
const SearchArea = () => {
    const navigate = useNavigate();
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [searchParam, setSearchParam] = useState("");
    const searchAreaRef = useRef(null);
    const listRef = useRef(null); // Ref for the list

    const handleClickOutside = (event) => {
        if (searchAreaRef.current && !searchAreaRef.current.contains(event?.target)) {
            setShowResults(false);
            setSearchResults([]);
            setSearchParam("");
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const mutation = useMutation(searchDeviceBySerialNumber, {
        onSuccess: (data) => {
            setShowResults(true);
            if (data.length > 0) {
                setSearchResults(data);
            } else {
                setSearchResults([]);
            }
        },
    });

    const handleSearch = (event) => {
        setSearchParam(event.target.value);
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            if (event.target.value) {
                mutation.mutate(event.target.value);
            } else {
                setShowResults(false);
                setSearchResults([]);
            }
        }, 300);
    };
    const handleNavigate = (projectId) => {
        navigate(`/Project/${projectId}`);
        handleClickOutside();
    };
    return (
        <div ref={searchAreaRef} className="position-relative">
            <Search
                placeholder="חפש"
                allowClear
                className="mw-275px"
                value={searchParam}
                onChange={handleSearch}
                loading={mutation.isLoading}
            />
            {showResults && (
                <Card title="תוצאות חיפוש" className="position-absolute start-0 top-100 w-500px mt-2 shadow-lg px-0 z-index-3">
                    {searchResults.length === 0 ? (
                        <EmptyData label="לא נמצאו מכשירים שתואמים לצ' שהוקלד." />
                    ) : (
                        <List
                            ref={listRef}
                            className={"mh-500px px-2 mx-2 scroll-y"}
                            itemLayout="vertical"
                            dataSource={searchResults}
                            renderItem={(item) => (
                                <List.Item key={item._id}>
                                    <div>
                                        <Flex justify="space-between" align="center">
                                            <Text className="fw-500">{` צ' ${item.serialNumber} - ${item.project?.projectName}`}</Text>
                                            <Tooltip title="עבור לפרוייקט">
                                                <CustomButton
                                                    type="light-primary"
                                                    shape="circle"
                                                    onClick={() => handleNavigate(item.project._id)}
                                                    icon={<DoubleLeftOutlined />}
                                                />
                                            </Tooltip>
                                        </Flex>
                                        <Flex align="center">
                                            <div>
                                                <Text className="text-muted">יחידה: {item.unit?.unitsName}</Text>
                                                <Divider type="vertical" />
                                                <Tag className="fw-500 fs-9" color={item.voucherOut ? "success" : "warning"}>
                                                    {item.voucherOut ? "נופק" : "ביחידה"}
                                                </Tag>
                                            </div>
                                            <Divider type="vertical" />
                                            <Tag className="fw-500 fs-9" color={tagColors[item.status]}>
                                                {item.status}
                                            </Tag>
                                        </Flex>
                                    </div>
                                </List.Item>
                            )}
                        />
                    )}
                </Card>
            )}
        </div>
    );
};

export default SearchArea;
