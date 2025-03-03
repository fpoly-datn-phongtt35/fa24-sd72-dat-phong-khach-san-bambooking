import React, { useEffect, useState } from "react";
import { DuLieu } from "../../services/DichVuService";
import { CapNhatDichVuSuDung } from "../../services/DichVuSuDungService";
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
    ngayBatDau: data?.ngayBatDau || "",
    ngayKetThuc: data?.ngayKetThuc || "",
    giaSuDung: data?.giaSuDung || "",
    trangThai: data?.trangThai ?? 1,
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
        ngayBatDau: data.ngayBatDau || "",
        ngayKetThuc: data.ngayKetThuc || "",
        giaSuDung: data.giaSuDung || "",
        trangThai: data.trangThai === true,
      });
    }
  }, [data, idxp]);

  // Hàm xử lý thay đổi giá trị input
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

  // Hàm xử lý submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Giá trị formData:", formData);
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

  const DoiTrangThai = () => {
    console.log(formData);
    const updatedFormData = {
      ...formData,
      trangThai: formData.trangThai === false ? true : false,
    };

    CapNhatDichVuSuDung(updatedFormData)
      .then((response) => {
        setFormData(updatedFormData);
      })
      .catch((error) => {
        console.error("Lỗi :", error);
      });
  };

  const HuyDichVu = () => {
    const updatedFormData = {
      ...formData,
      trangThai: 0,
    };

    CapNhatDichVuSuDung(updatedFormData)
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
          {/* Tên dịch vụ */}
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
            label="Ngày bắt đầu"
            type="datetime-local"
            fullWidth
            margin="dense"
            name="ngayBatDau"
            value={formData.ngayBatDau}
            onChange={handleInputChange}
            required
            InputProps={{ readOnly: true }}
          />

          <TextField
            label="Ngày kết thúc"
            type="datetime-local"
            fullWidth
            margin="dense"
            name="ngayKetThuc"
            value={formData.ngayKetThuc}
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
            required
            InputProps={{ readOnly: true }}
          />

          {/* Trạng thái */}
          <FormControl component="fieldset" margin="dense">
            <label>Trạng thái</label>
            <RadioGroup row name="trangThai" value={formData.trangThai} onChange={handleInputChange}>
              <FormControlLabel value="true" control={<Radio />} label="Đã sử dụng" />
              <FormControlLabel value="false" control={<Radio />} label="Chưa sử dụng" />
            </RadioGroup>
          </FormControl>
        </form>
      </DialogContent>

      <DialogActions>
        {data && (
          <Button variant="contained" color="error" onClick={HuyDichVu}>
            Hủy dịch vụ
          </Button>
        )}
        <Button variant="outlined" onClick={DoiTrangThai}>
          Đổi trạng thái
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DVSVDetail;
