import React, { useEffect, useState } from "react";
import { DuLieu } from "../../services/DichVuService";
import { UpdateDVSD, HuyDVSD } from "../../services/DichVuSuDungService";
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
    soLuongSuDung: data?.soLuongSuDung || 1,
    giaSuDung: data?.giaSuDung || 0,
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
        soLuongSuDung: data.soLuongSuDung || 1,
        giaSuDung: data.giaSuDung || 0,
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
    } else if (name === "soLuongSuDung") {
      // Chỉ cập nhật nếu giá trị không nhỏ hơn 1
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value >= 1 ? value : 1, // Nếu nhỏ hơn 1, đặt về 1
      }));
    } else if (name === "giaSuDung") {
      // Chỉ cập nhật nếu giá trị không nhỏ hơn 0
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value >= 0 ? value : 0, // Nếu nhỏ hơn 0, đặt về 0
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
      UpdateDVSD(formData)
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
    HuyDVSD(formData.id)
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
            inputProps={{ min: 1 }} // Ngăn nhập số nhỏ hơn 1
          />

          <TextField
            label="Giá sử dụng"
            type="number"
            fullWidth
            margin="dense"
            name="giaSuDung"
            value={formData.giaSuDung}
            onChange={handleInputChange}
            required
            inputProps={{ min: 0 }} // Ngăn nhập số nhỏ hơn 0
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