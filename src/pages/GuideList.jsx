import { Button, Layout, Space } from "antd";
const { Header, Footer, Sider, Content } = Layout;
import { Card, Col, Row } from "antd";
import CustomCard from "../components/CustomCard";
import { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useEffect } from "react";
import { Typography } from "antd";
const { Title, Text } = Typography;
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { signOut } from "firebase/auth";
const GuideList = () => {
  const [guides, setGuides] = useState([]);

	const fetchGuides = async () => {
		const ref = collection(db, "users");
		const q = query(ref, where("approved", "==", true));

    const querySnapshot = await getDocs(q);

    const guideList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setGuides(guideList);
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  console.log(guides);
  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Layout>
          <nav
            className="p-3 shadow"
            style={{
              backgroundColor: "#458bdf",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Title className="title" style={{ color: "white" }} level={3}>
              GoTo
            </Title>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: "auto",
              }}
            >
              <Button className="rounded-button" onClick={() => signOut(auth)} icon={<LogoutOutlined/>}>Logout</Button>
            </div>
          </nav>
          <Content style={{ padding: "40px" }}>
            <Row gutter={[16, 16]}>
              {guides.map((guide) => (
                <Col key={guide.id} span={8}>
                  <CustomCard guide={guide} />
                </Col>
              ))}
            </Row>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default GuideList;
