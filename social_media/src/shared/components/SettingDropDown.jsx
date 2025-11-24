import { IconButton, Menu, MenuItem } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { useContext, useState } from "react";
import { AuthContext } from "../../router/AuthProvider";
import CircularProgress from '@mui/material/CircularProgress';

export default function SettingDropdown() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const {logout} = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const handleOpen = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const handleLogout= async() =>{
        setLoading(true);
        try{
            await logout();
        }catch(err){
        console.log("Lỗi khi đăng xuất: ", err);
        }finally{
            setLoading(false);
        }
    }
    return (
        <>
            <IconButton color="primary" onClick={handleOpen}>
                <SettingsIcon />
            </IconButton>

            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={handleClose}>Change Password</MenuItem>
                <MenuItem onClick={handleLogout}>
                 {loading ? <CircularProgress size={16} /> : <> Logout </>}
                </MenuItem>
            </Menu> 
        </>
    );
}
