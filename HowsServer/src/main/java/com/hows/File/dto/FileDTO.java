package com.hows.File.dto;

public class FileDTO {

    private int file_seq;
    private String file_code;
    private String file_oriname;
    private String file_sysname;
    private int parent_seq;

    public int getFile_seq() {
        return file_seq;
    }

    public void setFile_seq(int file_seq) {
        this.file_seq = file_seq;
    }

    public String getFile_code() {
        return file_code;
    }

    public void setFile_code(String file_code) {
        this.file_code = file_code;
    }

    public String getFile_oriname() {
        return file_oriname;
    }

    public void setFile_oriname(String file_oriname) {
        this.file_oriname = file_oriname;
    }

    public String getFile_sysname() {
        return file_sysname;
    }

    public void setFile_sysname(String file_sysname) {
        this.file_sysname = file_sysname;
    }

    public int getParent_seq() {
        return parent_seq;
    }

    public void setParent_seq(int parent_seq) {
        this.parent_seq = parent_seq;
    }

    public FileDTO() {}

    public FileDTO(int file_seq, String file_code, String file_oriname, String file_sysname, int parent_seq) {
        this.file_seq = file_seq;
        this.file_code = file_code;
        this.file_oriname = file_oriname;
        this.file_sysname = file_sysname;
        this.parent_seq = parent_seq;
    }
}
