// ============================================================
//  Study Group 自动提交工具
//  使用方法：复制全部代码到 Google Apps Script，保存即可
// ============================================================

// ─── ① 配置区（第一次使用必须填写） ───────────────────────
var CONFIG = {

  // Study Group 表单提交的 API 地址
  // 获取方法：见下方 README 说明
  ENDPOINT: "https://students.studygroup.com/api/enquiry",  // ← 待确认

  // ── 默认值（每次提交都用这些） ──
  DEFAULTS: {
    enquiry_reason:  "how_to_apply",   // 咨询原因
    gender:          "female",         // 性别
    dob:             "2009-01-01",     // 生日
    nationality:     "TW",             // 国籍：TW=台湾 / HK=香港
    country:         "TW",             // 居住地（同上）
    destination:     "GB",             // 留学目的地：英国
    fee_payer:       "self",           // 学费支付：自费
    channel:         "lg",             // UTM 渠道（来自原始链接）
    campaign:        "2026_META+Ukstudy+paid"
  },

  // ── Google Sheet 列对应关系（A=1, B=2...）──
  COLUMNS: {
    first_name:  1,   // A列：名
    last_name:   2,   // B列：姓（如果只有一列姓名可合并处理）
    email:       3,   // C列：邮箱
    phone:       4,   // D列：手机号
    course:      5,   // E列：意向课程
    status:      6,   // F列：提交状态（脚本自动写入）
    submit_time: 7    // G列：提交时间（脚本自动写入）
  },

  // 数据从第几行开始（1=第一行，通常第1行是表头，所以填2）
  DATA_START_ROW: 2
};
// ─────────────────────────────────────────────────────────────


// ─── ② 菜单（打开 Sheet 时自动出现）────────────────────────
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("📋 Study Group 提交工具")
    .addItem("▶ 提交所有待处理行", "submitAll")
    .addItem("▶ 提交选中行", "submitSelected")
    .addSeparator()
    .addItem("🔄 重置失败行（重新提交）", "resetFailed")
    .addToUi();
}


// ─── ③ 新增行自动触发 ────────────────────────────────────────
// 在 Apps Script 编辑器里：触发器 → onEdit → 保存
function onEdit(e) {
  var sheet = e.range.getSheet();
  var row   = e.range.getRow();
  var col   = e.range.getColumn();

  // 只在数据行的姓名列有新内容时触发
  if (row >= CONFIG.DATA_START_ROW && col === CONFIG.COLUMNS.first_name) {
    var statusCell = sheet.getRange(row, CONFIG.COLUMNS.status);
    // 只有状态为空才自动提交（避免重复）
    if (!statusCell.getValue()) {
      submitRow(sheet, row);
    }
  }
}


// ─── ④ 提交所有待处理行 ─────────────────────────────────────
function submitAll() {
  var sheet    = SpreadsheetApp.getActiveSheet();
  var lastRow  = sheet.getLastRow();
  var count    = 0;

  for (var i = CONFIG.DATA_START_ROW; i <= lastRow; i++) {
    var status = sheet.getRange(i, CONFIG.COLUMNS.status).getValue();
    if (status === "" || status === "待提交") {
      var success = submitRow(sheet, i);
      if (success) count++;
      Utilities.sleep(1500); // 每条间隔1.5秒，避免被限流
    }
  }

  SpreadsheetApp.getUi().alert("✅ 完成！共提交 " + count + " 条记录。");
}


// ─── ⑤ 提交选中行 ───────────────────────────────────────────
function submitSelected() {
  var sheet     = SpreadsheetApp.getActiveSheet();
  var selection = SpreadsheetApp.getActiveRange();
  var startRow  = selection.getRow();
  var endRow    = startRow + selection.getNumRows() - 1;
  var count     = 0;

  for (var i = startRow; i <= endRow; i++) {
    if (i < CONFIG.DATA_START_ROW) continue;
    var success = submitRow(sheet, i);
    if (success) count++;
    Utilities.sleep(1500);
  }

  SpreadsheetApp.getUi().alert("✅ 完成！共提交 " + count + " 条记录。");
}


// ─── ⑥ 重置失败行 ───────────────────────────────────────────
function resetFailed() {
  var sheet   = SpreadsheetApp.getActiveSheet();
  var lastRow = sheet.getLastRow();
  var count   = 0;

  for (var i = CONFIG.DATA_START_ROW; i <= lastRow; i++) {
    var statusCell = sheet.getRange(i, CONFIG.COLUMNS.status);
    if (statusCell.getValue() === "❌ 失败") {
      statusCell.setValue("待提交");
      count++;
    }
  }

  SpreadsheetApp.getUi().alert("已重置 " + count + " 条失败记录，可重新提交。");
}


// ─── ⑦ 核心：提交单行数据 ────────────────────────────────────
function submitRow(sheet, row) {
  var c = CONFIG.COLUMNS;

  // 读取这一行的数据
  var firstName = sheet.getRange(row, c.first_name).getValue();
  var lastName  = c.last_name ? sheet.getRange(row, c.last_name).getValue() : "";
  var email     = sheet.getRange(row, c.email).getValue();
  var phone     = sheet.getRange(row, c.phone).getValue();
  var course    = sheet.getRange(row, c.course).getValue();

  // 跳过空行
  if (!firstName && !email && !phone) return false;

  // 标记为"提交中"
  sheet.getRange(row, c.status).setValue("⏳ 提交中...");
  SpreadsheetApp.flush();

  // 构建提交数据
  var payload = {
    // 来自 Sheet 的字段
    first_name:   firstName,
    last_name:    lastName,
    email:        email,
    phone:        phone,
    course:       course,

    // 默认值
    enquiry_type: CONFIG.DEFAULTS.enquiry_reason,
    gender:       CONFIG.DEFAULTS.gender,
    date_of_birth: CONFIG.DEFAULTS.dob,
    nationality:  CONFIG.DEFAULTS.nationality,
    country_of_residence: CONFIG.DEFAULTS.country,
    study_destination: CONFIG.DEFAULTS.destination,
    fee_payer:    CONFIG.DEFAULTS.fee_payer,

    // UTM 追踪参数
    channel:      CONFIG.DEFAULTS.channel,
    campaign:     CONFIG.DEFAULTS.campaign
  };

  // 发送 HTTP POST 请求
  try {
    var options = {
      method:      "post",
      contentType: "application/json",
      payload:     JSON.stringify(payload),
      headers: {
        "Accept":     "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; StudyGroupSubmitter/1.0)"
      },
      muteHttpExceptions: true
    };

    var response = UrlFetchApp.fetch(CONFIG.ENDPOINT, options);
    var code     = response.getResponseCode();
    var body     = response.getContentText();

    Logger.log("Row " + row + " → HTTP " + code + " | " + body.substring(0, 200));

    if (code >= 200 && code < 300) {
      // 成功
      sheet.getRange(row, c.status).setValue("✅ 已提交");
      sheet.getRange(row, c.submit_time).setValue(
        Utilities.formatDate(new Date(), "Asia/Taipei", "yyyy-MM-dd HH:mm:ss")
      );
      return true;
    } else {
      // 服务器返回错误
      sheet.getRange(row, c.status).setValue("❌ 失败 (HTTP " + code + ")");
      Logger.log("失败详情: " + body);
      return false;
    }

  } catch (err) {
    sheet.getRange(row, c.status).setValue("❌ 失败 (" + err.message + ")");
    Logger.log("异常: " + err.message);
    return false;
  }
}
