import { useEffect, useState } from "react";
import logo from "../../../assets/ecr-logo.svg";
import { ProfileCart } from "../../../common/Animation";
import { SingleImageUpload, InputField } from "../../../common/CommonInput";
import { useDispatch, useSelector } from "react-redux";
import { clearError, clearMessage, getAdminProfile, updateAdminProfile } from "../../../store/slice/userSlice";
import { errorAlert, successAlert } from "../../../utils/alertService";

const Profile = () => {
    const emojis = ["✈️", "🏖️", "🌴", "🏨", "🍹", "🚗", "🛳️", "🗺️", "🎢", "🌅"];
    const dispatch = useDispatch();
    const { userData, message, error } = useSelector((state) => state.user);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        dispatch(getAdminProfile());
    }, [dispatch]);

    useEffect(() => {
        if (message) {
            successAlert(message);
            dispatch(clearMessage())
        }
        if (error) {
            errorAlert(error);
            dispatch(clearError());
        }
    }, [message, error, dispatch]);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        profilePhoto: null,
    });

    useEffect(() => {
        if (userData) {
            setFormData({
                firstName: userData?.firstName || "",
                lastName: userData?.lastName || "",
                email: userData?.email || "",
                profilePhoto: null,
            });
            setPreview(userData?.profilePhoto || null);
        }
    }, [userData]);


    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "profilePhoto" && files?.[0]) {
            const file = files[0];
            setFormData((prev) => ({ ...prev, profilePhoto: file }));
            setPreview(URL.createObjectURL(file));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const removePhoto = () => {
        setFormData((p) => ({ ...p, profilePhoto: null }));
        setPreview(null);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("firstName", formData.firstName);
        data.append("lastName", formData.lastName);
        data.append("email", formData.email);

        if (formData.profilePhoto) {
            data.append("profilePhoto", formData.profilePhoto);
        }
        dispatch(updateAdminProfile(data));
    };


    return (
        <>
            <ProfileCart emojis={emojis} logo={logo} />
            <section className="mx-4 space-y-4 flex justify-center">
                <form onSubmit={handleSubmit} className="space-y-4 w-full">
                    <InputField
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                    <InputField
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                    <InputField
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <SingleImageUpload
                        name="profilePhoto"
                        preview={preview}
                        onUpload={handleChange}
                        onRemove={removePhoto}
                    />
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 rounded"
                    >
                        Save Profile
                    </button>
                </form>
            </section>
        </>
    );
};

export default Profile;