---
title: Fourier Optics Note-5
date: 2026-07-30 11:45:14
categories:
- Notes
tags:
- Optics
featured: false
description: Optical transfer function, ATF–OTF autocorrelation, and the effect of aberrations on imaging
---

## 光学传递函数 OTF

### Amplitude Transfer Function (ATF)

ATF 是冲激响应的傅里叶变换。我们已经知道，在相干成像中输入和输出之间只差一个冲激响应的卷积，

$$
U_i(x,y) = h(x,y) \ast U_o(x,y),
$$

因此很自然地将冲激响应的傅里叶变换定义为 ATF。对上式两边做傅里叶变换，卷积变为乘积，输入输出满足：

$$
G_i(f_x,f_y) = G_o(f_x,f_y) \cdot H_{ATF}(f_x,f_y)
$$

> Goodman 用下角标 g 来指代物，是因为他收到了德国的影响，在德语中，“物体”或“被观察的对象”叫做 "Gegenstand"（直译：对面的东西/客体）

之前我们知道冲激响应$h$和系统的瞳函数$P$之间有一个傅里叶变换关系：

$$
H(f_x,f_y) = \mathcal{F}\{h(x,y)\} = A \lambda z_i P(-\lambda z_i f_x, -\lambda z_i f_y)
$$

其中，$z_i$ 是像距，如果认为 $A \lambda z_i$ 是一个常数，那么 

$$
H(f_x,f_y) = P(-\lambda z_i f_x, -\lambda z_i f_y)
$$

### Coherent and Incoherent Imaging

相干和非相干是光学成像中完全不同的两种成像方式。相干成像中，光波的相位信息是保留的，而非相干成像中，光波的相位信息被忽略，只考虑光强分布。

- 相干成像(Coherent Imaging)：各物点发出的光在像面上发生复振幅的叠加，相位信息被保留。像面复振幅是物面复振幅与冲激响应的卷积，强度为卷积结果的模平方：

  $$
  U_i = h \ast U_o,
  \qquad
  I_i = |U_i|^2 = |h \ast U_o|^2.
  $$

- 非相干成像(Incoherent Imaging)：各物点发出的光在像面上发生强度叠加，相位信息被忽略。像面强度是物面强度与强度点扩散函数 $h_I=|h|^2$ 的卷积：

  $$
  I_i = h_I \ast I_o,
  \qquad
  h_I(x,y)=|h(x,y)|^2.
  $$

### OTF of Incoherent Imaging System

我们希望找到一个描述光强分布在光学系统中传递的函数，这个函数就是 OTF,Optical Transfer Function。

非相干成像中，像面强度是物面强度与强度点扩散函数 $h_I=|h|^2$ 的卷积：

$$
I_i(x,y) = h_I(x,y) \ast I_o(x,y).
$$

对两边做傅里叶变换，强度频谱满足乘积关系

$$
\mathcal{G}_i(f_x,f_y) = \mathcal{G}_o(f_x,f_y) \cdot \mathcal{H}(f_x,f_y),
$$

其中 $\mathcal{G}_o, \mathcal{G}_i$ 分别是物、像的强度频谱，$\mathcal{H}$ 就是 OTF。

首先将光强频谱做归一化傅里叶变换

> 做归一化傅里叶变换是为了消除光学系统的增益对频谱的影响，使得 OTF 只描述光学系统对频率的传递特性，而不受增益的影响，之后会给出一个详细的案例

非相干的 OTF 函数定义为：

$$
\mathcal{H}(f_x,f_y)  \ = \frac{\mathcal{F} \{ \vert h \vert^2 \}}{\iint \vert h \vert^2 \,\mathrm{d}x\,\mathrm{d}y}
$$

分母 $\iint |h|^2 \,\mathrm{d}x\,\mathrm{d}y$ 是 $h_I$ 的总能量，归一化后保证 $\mathcal{H}(0,0)=1$，即直流分量（均匀背景）无衰减地通过。

### OTF 是 ATF 的自相关

由 $h_I=|h|^2$ 出发，利用 $|h|^2 = h \cdot h^*$ 和傅里叶变换的乘积—卷积性质，可以证明 OTF 是 ATF 的归一化自相关。

设 $H(f_x,f_y)=\mathcal{F}\{h\}$ 为 ATF，则

$$
\mathcal{F}\{|h|^2\}
= H(f_x,f_y) \star H(f_x,f_y)
= \iint H(f_x',f_y')\,H^*(f_x'-f_x,f_y'-f_y)\,\mathrm{d}f_x'\,\mathrm{d}f_y',
$$

其中 $\star$ 表示互相关。归一化后，

$$
\boxed{
\mathcal{H}(f_x,f_y)
= \frac{H(f_x,f_y) \star H(f_x,f_y)}{\iint |H(f_x',f_y')|^2\,\mathrm{d}f_x'\,\mathrm{d}f_y'}
= \frac{\displaystyle\iint H(f_x',f_y')\,H^*(f_x'-f_x,f_y'-f_y)\,\mathrm{d}f_x'\,\mathrm{d}f_y'}{\displaystyle\iint |H(f_x',f_y')|^2\,\mathrm{d}f_x'\,\mathrm{d}f_y'}
}.
$$

这就是 OTF 与 ATF 的关系：**OTF 是 ATF 的归一化自相关函数**。由此可推出两个重要性质：

- **截止频率翻倍**：自相关使支撑域扩大一倍。若 ATF 的通带半径为 $f_c$，则 OTF 的支撑域半径为 $2f_c$。非相干成像的截止频率是相干成像的两倍。
- **OTF 一般为复数**：其模 $|\mathcal{H}|$ 称为调制传递函数 (MTF)，描述各频率分量的对比度衰减；其辐角 $\arg \mathcal{H}$ 称为相位传递函数 (PTF)，描述各频率分量的相移。无像差的实值 ATF 使 OTF 为实偶函数，PTF 为零。

### OTF or ATF

对于incoherent系统，我们更关注的是光强 $I$ 的传递而不是光场 $U$ 的传递。光强是光场的平方模，因此我们需要考虑光强的传递函数，而不是光场的传递函数。OTF 是描述光强传递的函数，它是 ATF 的自相关函数。

此时物体和成像之间的关系为：

$$
\mathcal{G}_i(f_x,f_y) = \mathcal{G}_o(f_x,f_y) \cdot \mathcal{H}(f_x,f_y)
$$

但是在相干场景中，光场的传递函数 ATF 就足够了，因为相干成像中光场的相位信息是保留的。

此时物体和成像之间的关系为：

$$
G_i(f_x,f_y) = G_o(f_x,f_y) \cdot H(f_x,f_y)
$$

## Aberration-Free System 

### Concepts Bank

- **Aberration-Free System:** 无像差系统，指的是光学系统在成像时没有任何像差，能够完美地将物体的光学信息传递到图像平面。
  - 一阶光学（高斯光学）是无像差光学，当满足旁轴条件时，从一个点发射的所有光线都能在像平面上聚焦到一个点上，形成清晰的像。**Goodman 书中的所有光学系统都是在旁轴条件下工作的，都是无像差系统**。
- **Aberration:** 像差，指的是光学系统在成像过程中由于各种因素导致的图像失真或模糊。
  - 当不满足傍轴条件时，即使不考虑光的衍射效应，光线也无法在像平面上聚焦到一个点上，而是形成一个模糊的光斑。赛德尔光学（三阶光学）以及更高阶的光学都是有像差的光学系统。
- **Diffraction-limited System:** 衍射受限系统，指的是光学系统的成像质量受限于光的衍射效应，而不是像差。
  - 即使在无像差的情况下，由于光的波动性，成像仍然会受到衍射的影响，导致图像无法无限清晰。

Goodman 对衍射受限系统的描述为 

```
"the presence of a point-source object yielded at the exit pupil a perfect spherical wave, converging toward the ideal geometrical image point. Such a system was called diffraction-limited."
```

即在无像差系统中，点光源在出瞳处产生一个完美的球面波，收敛到理想的几何像点，这样的系统被称为衍射受限系统。他是从波前的形状来定义衍射受限系统的，而不是从像差的角度来定义的。

真实的光学系统非常复杂，既有像差，也有衍射效应。根据抓主要矛盾的思想，需要平衡两者对系统的影响。为了简化分析，通常将光学系统分为两类：无像差系统和有像差系统。在无像差系统中，成像质量主要受衍射效应限制，而在有像差系统中，成像质量则受到像差的影响。

### 像差对 OTF 的影响
像差通过影响波前形状（等相位面）的方式对系统产生影响，通过一个相位因子 $W(x,y)$ 来描述。

$$
\mathcal{P}(x,y) = \exp {jW(x,y)} P(x,y)
$$

![Geometry_for_defining_the_aberration_function.png](/images/Geometry_for_defining_the_aberration_function.png)

考虑像差的瞳函数被称为广义瞳函数 (generalized pupil function)。

### 像差函数 $W$ 的定义

$W(x,y)$ 是出瞳处实际波前相对于理想球面参考波前的光程差 (OPD)。设参考球面波前以理想几何像点为中心、半径为 $z_i$（像距），则 $W(x,y)$ 表示出瞳面上点 $(x,y)$ 处实际波前与参考球面之间的轴向偏差。图中几何关系即由此定义：出瞳面上一点到理想像点的光程，与参考球面给出的光程之差，就是该点的像差函数值。

- $W=0$：实际波前与参考球面重合，系统无像差（衍射受限）。
- $W\neq 0$：实际波前发生畸变，各点不再同相到达像点，导致点像展宽、对比度下降。

### 像差如何影响 ATF 与 OTF

像差只改变瞳函数的相位，不改变其振幅透射区域，因此广义瞳函数 $\mathcal{P}$ 替换原来的 $P$ 后，ATF 变为

$$
H(f_x,f_y)
= \mathcal{P}(\lambda z_i f_x, \lambda z_i f_y)
= P(\lambda z_i f_x, \lambda z_i f_y)\,\exp\!\left[jW(\lambda z_i f_x, \lambda z_i f_y)\right].
$$

可见像差不改变 ATF 的通带范围（截止频率不变），只在通带内引入相位畸变。

非相干 OTF 是 ATF 的归一化自相关。代入广义瞳函数后，

$$
\mathcal{H}(f_x,f_y)
= \frac{\displaystyle\iint \mathcal{P}(f_x',f_y')\,\mathcal{P}^*(f_x'-f_x,f_y'-f_y)\,\mathrm{d}f_x'\,\mathrm{d}f_y'}{\displaystyle\iint |\mathcal{P}(f_x',f_y')|^2\,\mathrm{d}f_x'\,\mathrm{d}f_y'}.
$$

由于 $|\mathcal{P}|=|P|$，分母与无像差时相同；但分子中的相位因子 $\exp\{j[W(f_x',f_y')-W(f_x'-f_x,f_y'-f_y)]\}$ 一般小于 1 的模长贡献，使得

$$
|\mathcal{H}_{\text{有像差}}(f_x,f_y)| \leq |\mathcal{H}_{\text{无像差}}(f_x,f_y)|.
$$

即像差使 MTF 在各频率处下降（至少不升高），成像对比度降低。这一不等式是像差降低像质的数学表述。

### 常见像差举例

- **离焦 (Defocus)**：最简单的像差，波前曲率与参考球面不匹配。可写成出瞳面上的二次相位：

  $$
  W(x,y) = \frac{k}{2}\left(\frac{1}{z_i}-\frac{1}{z_i+\Delta z}\right)(x^2+y^2) \approx -\frac{k\,\Delta z}{2z_i^2}(x^2+y^2),
  $$

  其中 $\Delta z$ 是像面离焦量。离焦使 OTF 出现零点并改变符号，对应像面上出现对比度反转的频率区间。

- **球差 (Spherical Aberration)**：边缘光线与近轴光线焦距不同，波前偏差随孔径四次方增长：

  $$
  W(r) \propto r^4.
  $$

- **彗差 (Coma)**：离轴物点的非对称像差，点像呈彗星状拖尾，OTF 失去圆对称性。

- **像散 (Astigmatism)** 与 **场曲 (Field Curvature)**：子午面与弧矢面焦距不同，或像面弯曲，破坏等晕性。

这些像差通常用赛德尔像差或泽尼克多项式展开，在光学设计中逐项校正。

## Take Home Message

- ATF 是冲激响应的傅里叶变换，描述相干成像中复振幅的传递：$G_i = G_o \cdot H$。
- 相干成像对复振幅卷积再取模平方；非相干成像对强度卷积，强度 PSF 为 $h_I=|h|^2$。
- OTF 是归一化的强度 PSF 的傅里叶变换，描述非相干成像中强度的传递：$\mathcal{G}_i = \mathcal{G}_o \cdot \mathcal{H}$。
- **OTF 是 ATF 的归一化自相关**，因此非相干截止频率是相干截止频率的两倍。
- OTF 为复数：模为 MTF（对比度衰减），辐角为 PTF（相移）；无像差时 OTF 为实偶函数。
- 像差通过广义瞳函数 $\mathcal{P}=P\,e^{jW}$ 引入相位畸变，不改变截止频率，但使 MTF 各频率处下降。
- 衍射受限系统从波前形状定义：点源在出瞳处产生理想球面波，$W=0$。