import React, { useEffect, useState } from "react";
import { DuLieu } from "../../services/DichVuService";
import { CapNhatDichVuSuDung,XoaDichVuSuDung } from "../../services/DichVuSuDungService";
import { AddDichVuSuDung } from "../../services/ViewPhong";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";

const DVSVDetail = ({ show, handleClose, data, idxp }) => {
  const [ListDichVu, setListDichVu] = useState([]);
  const [formData, setFormData] = useState({
    id: data?.id || "",
    dichVu: { id: data?.dichVu?.id } || "",
    xepPhong: { id: idxp },
    soLuongSuDung: data?.soLuongSuDung || "",
    giaSuDung: data?.giaSuDung || "",
    trangThai: data?.trangThai ?? 0,
  });

  useEffect(() => {
    DuLieu().then((response) => {
      setListDichVu(response.data);
    });
  }, []);

  useEffect(() => {
    if (data) {
      setFormData({
        id: data.id || "",
        dichVu: { id: data.dichVu?.id || "" },
        xepPhong: { id: idxp },
        soLuongSuDung: data.soLuongSuDung || "",
        giaSuDung: data.giaSuDung || "",
        trangThai: data.trangThai === true,
      });
    }
  }, [data, idxp]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "dichVu") {
      const selectedDichVu = ListDichVu.find((dv) => dv.id === parseInt(value, 10));
      setFormData((prevFormData) => ({
        ...prevFormData,
        dichVu: { ...prevFormData.dichVu, id: value },
        giaSuDung: selectedDichVu ? selectedDichVu.donGia : "",
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (data != null) {
      CapNhatDichVuSuDung(formData)
        .then((response) => {
          console.log("Cập nhật thành công:", response.data);
          handleClose();
        })
        .catch((error) => {
          console.error("Lỗi khi cập nhật:", error);
        });
    } else {
      AddDichVuSuDung(formData)
        .then(() => {
          console.log("Dữ liệu thêm dịch vụ:", formData);
          handleClose();
        })
        .catch((error) => {
          console.error("Error adding service:", error);
        });
    }
  };


  const HuyDichVu = () => {
    XoaDichVuSuDung(formData.id)
      .then((response) => {
        console.log("Dịch vụ đã bị hủy:", response.data);
        handleClose();
      })
      .catch((error) => {
        console.error("Lỗi khi hủy dịch vụ:", error);
      });
  };

  return (
    <Dialog open={show} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Dịch vụ sử dụng</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="dense">
            <InputLabel>Tên dịch vụ</InputLabel>
            <Select
              value={formData.dichVu.id}
              name="dichVu"
              onChange={handleInputChange}
              disabled={data != null}
            >
              <MenuItem value="">Chọn dịch vụ</MenuItem>
              {ListDichVu.map((dv) => (
                <MenuItem key={dv.id} value={dv.id}>
                  {dv.tenDichVu}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Số lượng sử dụng"
            type="number"
            fullWidth
            margin="dense"
            name="soLuongSuDung"
            value={formData.soLuongSuDung}
            onChange={handleInputChange}
            required
          />


          <TextField
            label="Giá sử dụng"
            type="number"
            fullWidth
            margin="dense"
            name="giaSuDung"
            value={formData.giaSuDung}
            onChange={handleInputChange}
          />
          
        </form>
      </DialogContent>

      <DialogActions>
        {data && (
          <Button variant="contained" color="error" onClick={HuyDichVu}>
            Hủy dịch vụ
          </Button>
        )}

        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DVSVDetail;