#import "@preview/resume-ng:1.0.0": *

// Set main document font
#set text(font: ("New Computer Modern", "FandolSong"))

// Override template author name display with custom font
#show: project.with(
  title: "Resume-ng",
  author: (name:"汪嘉桥"),
  contacts:
    (
      "+86 13822790423",
      link("mailto:kakiuwang@gmail.com", "kakiuwang@gmail.com"),
      link("https://github.com/kakiuwang-ui", "GitHub: kakiuwang-ui"),
    )
)

// Apply specific font to author name display after template
#show text.where(text: "汪嘉桥"): it => text(font: "FandolSong")[汪嘉桥]

#set text(font: ("New Computer Modern", "FandolSong"))
#resume-section("教育经历")

#resume-education(
  university: "中国地质大学（武汉）",
  degree: "工学学士",
  school: "智能科学与技术，计算机学院",
  start: "2024-09",
  end: "2027-06"
)[
*GPA: /4.0(专业前%)* 主修课程：高等数学、数据结构与算法、计算机组成原理、计算机网络、计算机视觉、机器学习。*2027年应届毕业生*
]

#resume-section[技术能力]
- *编程语言*: C/C++(熟练), Python(熟练), JavaScript, TypeScript; 了解 #text(fill: gray, "Rust")
- *开发工具*: Git/GitHub, Docker, VS Code, Linux/macOS命令行
- *前端技术*: React, HTML/CSS, Vite构建工具
- *后端技术*: Node.js, Express, 文件处理, API设计
- *专业技能*: 算法设计, 数据结构, 机器学习, 音频信号处理, 计算机视觉

#resume-section[获奖经历]

- *2025年"深圳杯"数学建模挑战赛决赛优秀论文*
  LED显示器色彩优化系统
- *2025年全国大学生英语作文大赛省级二等奖*
- *2025年全国大学生统计建模大赛校级一等奖*
  音频特征工程自适应编码系统，显著提升编码效率
- *2024年中国地质大学（武汉）科技论文报告会校级三等奖*
- *2024年入选中国地质大学（武汉）大学英语ESS实验班*


#resume-section[项目经历]

#resume-project(
  title: "个人博客系统 (Rusty Raven's Blog)",
  duty: "全栈开发",
  start:"2025.9",
  end:"至今"
)[
  - 基于React + TypeScript + Node.js构建的现代化个人博客系统
  - 实现Typst文档渲染、音频播放、多语言支持、暗黑模式等功能
  - 技术栈：React 18、TypeScript、Express、文件上传、热重载
  - 功能特性：响应式设计、Typst渲染、Markdown渲染、文档管理、音频集成、主题切换
]

#resume-project(
  title: "LED显示器色彩优化系统",
  duty: "核心算法开发",
  start:"2025.6",
  end:"2025.8"
)[
  - 构建基于BT2020色域映射的全链路LED显示器色彩优化系统，获深圳杯数学建模竞赛决赛优秀论文
  - 实现多通道增强和像素校正算法，根据使用环境自动匹配最优色彩校正方案
  - 技术方案：色彩空间转换、图像处理算法、自适应参数调优
  - 项目成果：提升了LED显示器色彩准确性和观看体验
]

#resume-project(
  title: "音频特征工程自适应编码系统",
  duty: "算法设计与实现",
  start:"2025.3",
  end:"2025.4"
)[
  - 基于音频特征工程实现自适应编码系统，获全国统计建模大赛校级一等奖
  - 通过音频信号特征提取结合机器学习算法，实现高效音频编码和压缩
  - 技术实现：信号处理、特征工程、机器学习模型优化、编码算法设计
  - 项目效果：相比传统方案显著提升压缩效率，保持音质的同时减少存储空间
]



#resume-section[个人总结]

- 计算机科学基础扎实，算法设计能力强，在数学建模和统计建模竞赛中多次获奖
- 具备全栈开发能力，熟悉现代Web技术栈，有完整项目从零到一的开发经验
- 英语能力良好，具备技术文档阅读和学术交流能力，关注国际前沿技术发展
- 热爱开源技术，有GitHub项目开发和维护经验，善于技术写作和知识分享
- 自驱能力强，学习能力突出，具备良好的沟通协作和问题解决能力