import React from "react";
import { Button, Modal, Form, Input, Checkbox, message } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { auth } from "../firebase";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
	GoogleAuthProvider,
	createUserWithEmailAndPassword,
	signInWithPopup,
} from "firebase/auth";
const SignUpTourist = () => {
	const [isModalOpen, setIsModalOpen] = React.useState(false);
	const onFinish = async (values) => {
		try {
			const { email, password } = values;
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const uid = userCredential.user.uid;
			const user = {
				email,
				role: "tourist",
			};

			await setDoc(doc(db, "users", uid), user);
			message.success("Signup successful!");
			handleCancel();
		} catch (error) {
			console.error("Error signing up: ", error);
			message.error("Error signing up.");
		}
	};
	const handleGoogleSignup = async () => {
		const provider = new GoogleAuthProvider();

		try {
			const result = await signInWithPopup(auth, provider);
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const token = credential.accessToken;
			const user = result.user;

			const emailExists = await checkEmailExists(user.email);

			if (!emailExists) {
				const userObject = {
					email: user.email,
					role: "Tourist",
				};

				await setDoc(doc(db, "users", user.uid), userObject);

				message.success("Signup successful!");
			} else {
				message.error("Email is already registered.");
			}

			handleCancel();
		} catch (error) {
			console.error("Error signing up with Google: ", error);
			message.error("Error signing up with Google.");
		}
	};

	const checkEmailExists = async (email) => {
		const usersRef = doc(db, "users", email);
		const docSnap = await getDoc(usersRef);
		return docSnap.exists();
	};
	const onFinishFailed = (errorInfo) => {
		console.log("Failed:", errorInfo);
	};

	const showModal = () => {
		setIsModalOpen(true);
	};

	const handleOk = () => {
		setIsModalOpen(false);
	};

	const handleCancel = () => {
		setIsModalOpen(false);
	};

	return (
		<>
			<Button type="primary" onClick={showModal}>
				Open Sign Up Modal
			</Button>
			<Modal
				className="custom-modal" // Add this class for custom styling
				title={<h3>Sign Up</h3>}
				visible={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
				footer={null}
			>
				<Form
					requiredMark={false}
					layout="vertical"
					name="basic"
					initialValues={{
						remember: true,
					}}
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
					autoComplete="off"
				>
					<Form.Item
						label="Email"
						name="email"
						rules={[
							{
								required: true,
								message: "Please input your email!",
							},
							{
								type: "email",
								message: "Please enter a valid email address",
							},
						]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						label="Password"
						name="password"
						rules={[
							{
								required: true,
								message: "Please input your password!",
							},
							{
								min: 6,
								message: "Password must be at least 6 characters",
							},
						]}
					>
						<Input.Password />
					</Form.Item>

					<Form.Item
						label="Confirm Password"
						name="confirmPassword"
						dependencies={["password"]}
						rules={[
							{
								required: true,
								message: "Please confirm your password!",
							},
							({ getFieldValue }) => ({
								validator(_, value) {
									if (!value || getFieldValue("password") === value) {
										return Promise.resolve();
									}
									return Promise.reject(
										new Error("The two passwords do not match!")
									);
								},
							}),
						]}
					>
						<Input.Password />
					</Form.Item>

					<Form.Item
						name="agree"
						valuePropName="checked"
						wrapperCol={{
							offset: 0,
							span: 24,
						}}
						rules={[
							{
								required: true,
								message: "Please accept the terms and conditions!",
							},
						]}
					>
						<Checkbox>
							I agree to the <a href="/terms">terms and conditions</a>
						</Checkbox>
					</Form.Item>

					<Form.Item>
						<Button type="primary" htmlType="submit" block>
							Sign Up
						</Button>
					</Form.Item>
				</Form>
				<div style={{ marginTop: 16, textAlign: "center" }}>
					<Button
						icon={<GoogleOutlined />}
						style={{ background: "white", border: "1px solid #ccc" }}
						block
						onClick={() => {
							handleGoogleSignup();
						}}
					>
						Sign Up with Google
					</Button>
				</div>
			</Modal>
		</>
	);
};

export default SignUpTourist;
