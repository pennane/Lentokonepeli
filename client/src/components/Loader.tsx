import { Box, Flex } from "@mantine/core";
import "./Loader.css";

const Loader = () => {
    return (
        <Flex align={"center"} justify={"center"} direction={"column"}>
            <Box
                w={128}
                h={128}
                style={{ overflow: "hidden", borderRadius: "8px", margin: "1rem", position: "relative" }}
            >
                <video
                    src={"loader.mp4"}
                    autoPlay
                    loop
                    muted
                    style={{
                        width: "200%",
                        height: "200%",
                        transform: "translate(-49%, -54%)",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                    }}
                />
            </Box>
            <div className="loading-text">
                Loading
                <span className="dot">.</span>
                <span className="dot">.</span>
                <span className="dot">.</span>
            </div>
        </Flex>
    );
};

export default Loader;
