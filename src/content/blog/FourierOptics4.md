---
title: Fourier Optics Note-4
date: 2026-07-17 14:00:00
categories:
- Notes
tags:
- Optics
featured: true
description: Thin-lens phase, coherent imaging, and the impulse response of a diffraction-limited optical system
---

## 薄透镜：把曲率写进波前

前一篇说明了透镜如何在后焦面显示入射场的空间频谱。本文进一步讨论一个更一般的问题：**物体经过“自由传播—薄透镜—自由传播”后，像面上的复振幅如何由物面复振幅决定？**

在傍轴标量理论中，这个问题可以作为线性系统来处理。透镜负责施加二次相位，有限孔径决定系统能传递哪些空间频率，而整个成像系统可以由一个点物体的响应——冲激响应——完全表征。


### 薄透镜近似

薄透镜近似把透镜的两个折射面压缩到同一个平面。光线在透镜前后的横向坐标都记作 $(x,y)$，忽略透镜厚度造成的横向位移。它通常还包含以下假设：

- 透镜厚度远小于物距、像距和焦距；
- 光线与光轴夹角较小，满足傍轴近似；
- 透镜材料均匀，且忽略多次反射、吸收和像差；
- 只讨论单色标量场。

理想薄透镜不直接改变入射场的强度，而是通过不同位置的光程差改变相位。去掉与 $(x,y)$ 无关的整体相位后，其复振幅透射函数为

$$
t_L(x,y)
=
P(x,y)
\exp\left[
-\frac{jk}{2f}(x^2+y^2)
\right],
$$

其中 $P(x,y)$ 是透镜的瞳函数：理想透明区域内取 $1$，外部取 $0$；若存在振幅衰减或像差，也可以把它们写进复数形式的 $P$。

因此透镜施加的相位为

$$
\phi_L(x,y)=-\frac{k}{2f}(x^2+y^2).
$$

负号意味着透镜边缘相对于中心产生相位超前，使平面波获得朝向焦点的球面曲率。若采用另一套时间因子和传播相位约定，所有传播相位与透镜相位的符号会同时反转，物理结果不变。

### 焦距

对处在空气中的薄透镜，若透镜折射率为 $n$，两表面的有符号曲率半径为 $R_1$、$R_2$，则 lensmaker equation 为

$$
\frac{1}{f}
=(n-1)
\left(
\frac{1}{R_1}-\frac{1}{R_2}
\right).
$$

曲率半径的正负取决于所采用的符号约定，所以实际代入前必须先统一表面法线与传播方向。厚透镜还会出现主平面位置和厚度修正，不能继续直接使用这个形式。

---

## 为什么线性系统可以用冲激响应描述

设输入面坐标为 $(\xi,\eta)$，输入复振幅为 $U_0(\xi,\eta)$。二维 Dirac delta 满足

$$
U_0(\xi,\eta)
=
\iint
U_0(\xi_0,\eta_0)
\delta(\xi-\xi_0,\eta-\eta_0)
\,\mathrm d\xi_0\mathrm d\eta_0.
$$

这可以理解为：任意输入都是无数个位于 $(\xi_0,\eta_0)$、权重为 $U_0(\xi_0,\eta_0)$ 的点输入之和。

令光学系统对应算子 $\mathcal L$。如果系统是线性的，

$$
\mathcal L\{aU_1+bU_2\}
=a\mathcal L\{U_1\}+b\mathcal L\{U_2\},
$$

就可以把算子移入积分：

$$
\begin{aligned}
U_i(x,y)
&=\mathcal L\{U_0\}\\
&=
\iint U_0(\xi_0,\eta_0)
\mathcal L\{
\delta(\xi-\xi_0,\eta-\eta_0)
\}
\,\mathrm d\xi_0\mathrm d\eta_0.
\end{aligned}
$$

定义系统对位于 $(\xi_0,\eta_0)$ 的单位点源的响应为

$$
h(x,y;\xi_0,\eta_0)
=
\mathcal L\{
\delta(\xi-\xi_0,\eta-\eta_0)
\},
$$

便得到最一般的线性系统表达式

$$
\boxed{
U_i(x,y)
=
\iint
h(x,y;\xi,\eta)
U_0(\xi,\eta)
\,\mathrm d\xi\mathrm d\eta
}.
$$

这里的 $h(x,y;\xi,\eta)$ 有四个坐标，因为系统对不同物点的响应未必只是简单平移。

### 什么时候才能写成卷积

线性本身只保证上面的叠加积分。若系统还具有横向平移不变性，即移动输入只会使输出作相同的坐标移动，则

$$
h(x,y;\xi,\eta)=h(x-\xi,y-\eta),
$$

于是，这个四元函数可以被简化为关于两个差值的二元函数

$$
U_i(x,y)=U_0(x,y)*h(x,y).
$$

真实成像系统还带有放大率和倒像。若横向放大率

$$
M=-\frac{z_2}{z_1},
$$

物点 $(\xi,\eta)$ 的几何像点位于 $(M\xi,M\eta)$。因此更合适的平移不变量不是 $x-\xi$，而是

$$
x-M\xi,\qquad y-M\eta.
$$

把物体先映射到理想像面坐标后，系统才表现为普通卷积。这个结论通常只在有限视场内成立；离轴像差、渐晕或空间变化的瞳函数都会破坏等晕性（isoplanatism）。

---

## 薄透镜成像系统的冲激响应

考虑如下系统：

$$
\text{物面}
\xrightarrow{\ z_1\ }
\text{薄透镜}
\xrightarrow{\ z_2\ }
\text{像面}.
$$

物面坐标为 $(\xi,\eta)$，透镜面坐标为 $(u,v)$，像面坐标为 $(x,y)$。为突出各个二次相位的来源，先考虑位于 $(\xi,\eta)$ 的单位点输入。

### 第一次 Fresnel 传播

点输入传播到透镜面后为

$$
U_L^-(u,v;\xi,\eta)
=
\frac{e^{jkz_1}}{j\lambda z_1}
\exp\left\{
\frac{jk}{2z_1}
\left[
(u-\xi)^2+(v-\eta)^2
\right]
\right\}.
$$

通过透镜后，

$$
U_L^+
=
U_L^-P(u,v)
\exp\left[
-\frac{jk}{2f}(u^2+v^2)
\right].
$$

再传播 $z_2$ 到像面，并忽略只与系统参数有关的整体常数，可以得到

$$
\begin{aligned}
h(x,y;\xi,\eta)
=&\ C
\exp\left[
\frac{jk}{2z_1}(\xi^2+\eta^2)
\right]
\exp\left[
\frac{jk}{2z_2}(x^2+y^2)
\right]\\
&\times
\iint P(u,v)
\exp\left\{
\frac{jk}{2}
\left(
\frac{1}{z_1}+\frac{1}{z_2}-\frac{1}{f}
\right)
(u^2+v^2)
\right\}\\
&\qquad\times
\exp\left[
-jk
\left(
u\left(\frac{\xi}{z_1}+\frac{x}{z_2}\right)
+v\left(\frac{\eta}{z_1}+\frac{y}{z_2}\right)
\right)
\right]
\,\mathrm du\mathrm dv,
\end{aligned}
$$

其中

$$
C=\frac{e^{jk(z_1+z_2)}}{(j\lambda)^2z_1z_2}.
$$

这个表达式看起来复杂，但它把问题准确地拆成了三类二次相位：

1. 物面坐标的二次相位；
2. 像面坐标的二次相位；
3. 透镜面上由两次传播和透镜共同产生的二次相位。

下面分别处理它们。

## 三类二次相位怎样处理

### 1. 透镜面二次相位：用高斯成像条件抵消

透镜积分中 $(u^2+v^2)$ 的系数为

$$
\frac{1}{z_1}+\frac{1}{z_2}-\frac{1}{f}.
$$

若物面、透镜和像面满足 Gaussian imaging equation

$$
\boxed{
\frac{1}{z_1}+\frac{1}{z_2}=\frac{1}{f}
},
$$

两次自由传播带来的正二次相位恰好与薄透镜的负二次相位抵消。这里的“去掉”是严格依赖成像条件的；若像面离焦，该项不会消失，而会作为离焦像差保留在广义瞳函数中。

满足成像条件后，

$$
\begin{aligned}
h(x,y;\xi,\eta)
=&\ C
\exp\left[
\frac{jk}{2z_1}(\xi^2+\eta^2)
\right]
\exp\left[
\frac{jk}{2z_2}(x^2+y^2)
\right]\\
&\times
\iint P(u,v)
\exp\left[
-j2\pi
\left(
f_u u+f_v v
\right)
\right]
\,\mathrm du\mathrm dv,
\end{aligned}
$$

其中

$$
f_u=\frac{1}{\lambda}
\left(
\frac{\xi}{z_1}+\frac{x}{z_2}
\right),
\qquad
f_v=\frac{1}{\lambda}
\left(
\frac{\eta}{z_1}+\frac{y}{z_2}
\right).
$$

因此冲激响应的核心就是瞳函数的二维傅里叶变换。

### 2. 物面二次相位：近似常数或由照明曲率补偿

物面因子为

$$
q_o(\xi,\eta)
=
\exp\left[
\frac{jk}{2z_1}(\xi^2+\eta^2)
\right].
$$

它不能因为模长为 $1$ 就随意删除，因为它会改变不同物点贡献之间的相对相位（**它会被带入到积分中进行积分运算**）。常见的处理有三种：

- **小视场近似**：若物体范围内最大相位变化远小于允许误差，即

  $$
  \frac{k}{2z_1}
  \max(\xi^2+\eta^2)
  \ll1,
  $$

  则可以把它近似为常数。

- **使用曲面物面**：若物体分布在以透镜中心为球心、半径约为 $z_1$ 的球面上，以相应曲面坐标描述物体时，这个传播曲率不再表现为额外的平面二次相位。

- **用会聚球面波照明**：在平面物体上预先施加

  $$
  q_{\mathrm{ill}}(\xi,\eta)
  =
  \exp\left[
  -\frac{jk}{2z_1}(\xi^2+\eta^2)
  \right],
  $$

  它会与 $q_o$ 抵消。其物理意义是照明波前朝透镜中心会聚。

因此，“物面相位被去掉”并不是透镜自动完成的，而是依靠有限视场近似、曲面几何或特定照明条件。

### 3. 像面二次相位：强度成像中可以忽略

像面因子为

$$
q_i(x,y)
=
\exp\left[
\frac{jk}{2z_2}(x^2+y^2)
\right].
$$

由于

$$
|q_i(x,y)|=1,
$$

它不改变单个像面上的强度（在研究某一点的强度时，这个因子是固定的，不会参与积分，可以直接提出来，且这个因子的模长为1，不影响幅值）：

$$
|q_iU_i|^2=|U_i|^2.
$$

所以只讨论普通强度图像时，常把它省略。但在相干叠加、干涉测量、数字全息、相位恢复或像面后的继续传播中，它是实际波前曲率的一部分，必须保留。

## 从冲激响应到点扩散函数

定义瞳函数的傅里叶变换

$$
\widetilde P(f_u,f_v)
=
\iint P(u,v)
e^{-j2\pi(f_uu+f_vv)}
\,\mathrm du\mathrm dv.
$$

忽略或补偿物面二次相位，并暂时略去不影响强度的像面相位后，

$$
h(x,y;\xi,\eta)
\propto
\widetilde P
\left[
\frac{1}{\lambda}
\left(
\frac{\xi}{z_1}+\frac{x}{z_2}
\right),
\frac{1}{\lambda}
\left(
\frac{\eta}{z_1}+\frac{y}{z_2}
\right)
\right].
$$

使用放大率 $M=-z_2/z_1$，有

$$
\frac{\xi}{z_1}+\frac{x}{z_2}
=
\frac{x-M\xi}{z_2},
$$

因此

$$
\boxed{
h(x,y;\xi,\eta)
\propto
\widetilde P
\left(
\frac{x-M\xi}{\lambda z_2},
\frac{y-M\eta}{\lambda z_2}
\right)
}.
$$

这说明系统对一个点物体不会产生无限小的几何像点，而会产生一个由瞳函数傅里叶变换决定的衍射斑。它以几何像点 $(M\xi,M\eta)$ 为中心，形状在等晕近似下不随物点位置改变。

若把物体先映射到理想像面坐标

$$
U_g(x,y)
=
\frac{1}{|M|^2}
U_0\left(\frac{x}{M},\frac{y}{M}\right),
$$

则像面复振幅可以写成

$$
U_i(x,y)
\propto
q_i(x,y)
\left[
U_g*h_c
\right](x,y),
$$

其中 coherent amplitude spread function 为

$$
h_c(x,y)
=
\widetilde P
\left(
\frac{x}{\lambda z_2},
\frac{y}{\lambda z_2}
\right).
$$

这就是相干成像系统的卷积形式。

### 无限孔径与有限孔径

若理想化地令 $P(u,v)=1$ 且孔径无限大，则

$$
\widetilde P(f_u,f_v)
=\delta(f_u,f_v),
$$

系统把点物体映射为几何像点，没有衍射展宽。这只是几何光学极限。

真实透镜具有有限孔径。对直径为 $D$ 的均匀圆瞳，振幅响应为 jinc 型函数，强度点扩散函数为 Airy pattern；第一暗环半径约为

$$
r_{\mathrm{Airy}}
\approx
1.22\frac{\lambda z_2}{D}
\approx
0.61\frac{\lambda}{\mathrm{NA}}
$$

（最后一个形式使用像方近轴数值孔径）。孔径越大，$\widetilde P$ 越窄，点像越集中，能够传递的空间频率范围也越宽。

## Example

### 圆形孔径、冲激响应与传递函数

下面用一个单一空间频率的输入，说明瞳函数 $P$、相干传递函数 $H_c$ 和冲激响应 $h_c$ 的关系。设系统满足薄透镜成像条件，并已把倒像和放大率吸收到理想几何像 $U_g(x,y)$ 的坐标中。

#### 第一步：从圆形瞳函数得到传递函数

设无像差透镜的孔径直径为 $L$，瞳函数为

$$
P(u,v)
=
\operatorname{circ}
\left(
\frac{2\sqrt{u^2+v^2}}{L}
\right),
$$

即透镜内部振幅透过率为 $1$，外部为 $0$。

相干成像系统在空间频率域满足

$$
\widetilde U_i(f_x,f_y)
=
\widetilde U_g(f_x,f_y)
H_c(f_x,f_y).
$$

相干传递函数就是经过坐标缩放的瞳函数：

$$
\boxed{
H_c(f_x,f_y)
=
P(\lambda z_2f_x,\lambda z_2f_y)
}.
$$

代入圆形瞳函数，

$$
\boxed{
H_c(f_x,f_y)
=
\operatorname{circ}
\left(
\frac{\sqrt{f_x^2+f_y^2}}{f_c}
\right)
},
$$

其中相干截止频率为

$$
f_c=\frac{L}{2\lambda z_2}
\approx\frac{\mathrm{NA}}{\lambda}.
$$

因此圆形孔径在频域中就是一个圆形低通滤波器：

$$
H_c(f_x,f_y)
=
\begin{cases}
1,
&\sqrt{f_x^2+f_y^2}\leq f_c,\\
0,
&\sqrt{f_x^2+f_y^2}>f_c.
\end{cases}
$$

这里已经能直接看出有限孔径的作用：通带内的空间频率完整通过，通带外的空间频率被挡住。

#### 第二步：传递函数的逆傅里叶变换就是冲激响应

空间域和频域是一对傅里叶变换关系：

$$
\boxed{
H_c(f_x,f_y)=\mathcal F\{h_c(x,y)\}
},
$$

$$
\boxed{
h_c(x,y)=\mathcal F^{-1}\{H_c(f_x,f_y)\}
}.
$$

圆形频域通带的逆傅里叶变换是 jinc 函数。令

$$
r=\sqrt{x^2+y^2},
\qquad
s=\frac{\pi Lr}{\lambda z_2},
$$

并把轴上振幅归一化为 $1$，则

$$
\boxed{
h_c(x,y)
=
\frac{2J_1(s)}{s}
}.
$$

因此，同一个有限孔径可以用两种完全等价的方式理解：

- 在频域中，它用 $H_c$ 截止高空间频率；
- 在空间域中，它使输入与具有有限宽度的 $h_c$ 卷积。

两种输出表达式分别是

$$
\widetilde U_i=\widetilde U_gH_c
$$

和

$$
U_i=U_g*h_c.
$$

乘积与卷积是同一件事在两个域中的表示。圆形瞳函数的锐利频率边界，对应空间域中带有旁瓣的 jinc 冲激响应。

#### 第三步：输入一个余弦条纹

取最简单的非均匀输入

$$
U_g(x,y)
=
1+m\cos(2\pi f_0x),
$$

其中 $m$ 是调制度，$f_0$ 是条纹的空间频率。它的频谱只包含三个离散分量：

$$
\widetilde U_g(f_x,f_y)
=
\delta(f_x,f_y)
+\frac{m}{2}
\delta(f_x-f_0,f_y)
+\frac{m}{2}
\delta(f_x+f_0,f_y).
$$

系统输出频谱为

$$
\widetilde U_i
=
\widetilde U_gH_c.
$$

直流分量位于原点，一定能够通过。两个条纹分量位于 $(\pm f_0,0)$，是否通过只取决于这两个点是否位于圆形瞳函数对应的通带内。

当

$$
f_0\leq f_c
$$

时，

$$
H_c(\pm f_0,0)=1,
$$

所以

$$
\boxed{
U_i(x,y)=1+m\cos(2\pi f_0x)
}.
$$

除了整体比例和相位，条纹被无失真传递。这就是“输入本身没有超过系统截止频率时，有限孔径仍可实现理想相干成像”的具体例子。

当

$$
f_0>f_c
$$

时，

$$
H_c(\pm f_0,0)=0.
$$

两个交流频率分量全部被挡住，只剩直流项：

$$
\boxed{
U_i(x,y)=1
}.
$$

此时输出成为均匀光场，原有条纹完全消失。

这个例子可以压缩成一条关系链：

$$
\boxed{
P(u,v)
\xrightarrow{\text{坐标缩放}}
H_c(f_x,f_y)
\xleftrightarrow{\ \mathcal F\ }
h_c(x,y)
}
$$

其中 $P$ 是透镜平面上的物理孔径，$H_c$ 描述每个空间频率是否能够通过，$h_c$ 描述一个点经过系统后扩展成什么形状。

### Goodman 习题 5-5：有限孔径何时不产生渐晕

> 说明：题目截图中的编号是 5-5。不同版本或习题编排中编号可能不同，下面按截图内容解答。

输入函数 $U_0$ 被直径为 $D$ 的圆形区域限制，并置于直径为 $L$、焦距为 $f$ 的正透镜前焦面。输入由正入射平面波照明，在透镜后焦面测量强度，且 $L>D$。

这个系统的理想结果是

$$
U_f(x,y)
\propto
\widetilde U_0
\left(
\frac{x}{\lambda f},
\frac{y}{\lambda f}
\right),
$$

所以后焦面位置 $(x,y)$ 对应输入空间频率

$$
\nu_x=\frac{x}{\lambda f},
\qquad
\nu_y=\frac{y}{\lambda f}.
$$

有限透镜可能截断到达某个频谱点的光束，这称为渐晕。这里讨论的“无渐晕”是指有限孔径尚未改变该频率处的理想傅里叶谱，并不意味着有限孔径能够对任意点物体作无衍射的完美成像。

#### 几何关系

先看一维截面。后焦面位置 $x$ 对应倾角

$$
\theta\approx\frac{x}{f}=\lambda\nu_x.
$$

来自整个输入口径的这组光线，在透镜面上仍占据直径为 $D$ 的区域，但其中心相对于透镜中心移动了

$$
\Delta=f\theta=x=\lambda f\nu_x.
$$

二维情况下只需把它改成径向位移

$$
\Delta
=
\lambda f\nu,
\qquad
\nu=\sqrt{\nu_x^2+\nu_y^2}.
$$

因此问题等价于：一个直径为 $D$ 的光束圆斑平移 $\Delta$ 后，与直径为 $L$ 的透镜圆孔如何重合。

#### (a) 无渐晕的最大空间频率

要使直径 $D$ 的整个光束圆斑仍包含在透镜孔径内，必须满足

$$
\Delta+\frac{D}{2}\leq\frac{L}{2}.
$$

代入 $\Delta=\lambda f\nu$：

$$
\lambda f\nu+\frac{D}{2}\leq\frac{L}{2}.
$$

因此无渐晕的最大径向空间频率为

$$
\boxed{
\nu_{\mathrm{no\;vignetting}}
=
\frac{L-D}{2\lambda f}
}.
$$

当

$$
\nu\leq\frac{L-D}{2\lambda f}
$$

时，测得的后焦面强度能够准确表示

$$
\left|
\widetilde U_0(\nu_x,\nu_y)
\right|^2.
$$

#### (b) 数值计算

题目给出

$$
L=4\ \mathrm{cm}=0.04\ \mathrm m,
$$

$$
D=2\ \mathrm{cm}=0.02\ \mathrm m,
$$

$$
f=50\ \mathrm{cm}=0.5\ \mathrm m,
\qquad
\lambda=6\times10^{-7}\ \mathrm m.
$$

所以

$$
\begin{aligned}
\nu_{\mathrm{no\;vignetting}}
&=
\frac{0.04-0.02}
{2(6\times10^{-7})(0.5)}\\
&=
3.33\times10^4\ \mathrm{cycles/m}\\
&=
\boxed{
33.3\ \mathrm{cycles/mm}
}.
\end{aligned}
$$

#### (c) 频谱从何处开始完全消失

当输入光束圆斑与透镜圆孔完全不相交时，即使输入在该频率处具有非零频谱，探测器也收不到相应贡献。完全不相交的条件为

$$
\Delta-\frac{D}{2}\geq\frac{L}{2},
$$

也就是

$$
\Delta\geq\frac{L+D}{2}.
$$

因此完全截止频率为

$$
\boxed{
\nu_{\mathrm{cutoff}}
=
\frac{L+D}{2\lambda f}
}.
$$

代入题中数值：

$$
\begin{aligned}
\nu_{\mathrm{cutoff}}
&=
\frac{0.04+0.02}
{2(6\times10^{-7})(0.5)}\\
&=
1.00\times10^5\ \mathrm{cycles/m}\\
&=
\boxed{
100\ \mathrm{cycles/mm}
}.
\end{aligned}
$$

整个频率范围因此分成三段：

$$
\begin{cases}
0\leq\nu\leq\dfrac{L-D}{2\lambda f},
&\text{无渐晕，准确测得频谱；}\\[8pt]
\dfrac{L-D}{2\lambda f}<\nu<
\dfrac{L+D}{2\lambda f},
&\text{部分渐晕，频谱受到畸变；}\\[8pt]
\nu\geq\dfrac{L+D}{2\lambda f},
&\text{光束与透镜无重叠，测得频谱为零。}
\end{cases}
$$

这里出现两个不同的频率边界，是因为“开始被孔径削减”和“被孔径完全挡住”不是同一件事。

#### 直观理解
一个直观的理解是，输入可以用角谱表示为不同方向的平面波的叠加，不同的空间频率对应不同的传播方向/入射角。有限孔径会限制其中的一些方向的平面波，导致频谱被削减。

Goodman 的这道例题说明了有限孔径对成像的影响，它通过限制了某些空间频率的传递，导致了渐晕现象。只有在空间频率低于某个阈值时，才能保证无渐晕的成像效果。

## 冲激响应的物理意义

上面的结果可以从四个层面理解：

- **衍射角度**：每个物点照亮整个瞳孔，瞳孔上各点在像面相干叠加；只有几何像点附近接近同相。
- **系统角度**：冲激响应记录一个点输入如何被系统展宽和变形，任意物体的像由这些点响应线性叠加而成。
- **频域角度**：相干振幅传递函数是瞳函数的缩放版本；有限孔径相当于限制可通过的空间频率。
- **成像角度**：Gaussian imaging equation 只保证几何聚焦，有限孔径仍会产生衍射斑，因此“在焦”不等于“点像尺寸为零”。

还要注意，相干和非相干成像的叠加对象不同：

- 相干成像先对**复振幅**卷积，再取模平方：

  $$
  I_i=|U_g*h_c|^2.
  $$

- 空间非相干成像对各物点的**强度**相加：

  $$
  I_i=I_g*h_I,
  \qquad
  h_I=|h_c|^2.
  $$

因此不能把相干振幅冲激响应直接当成非相干强度 PSF 使用。两者的传递函数和截止频率也不同。

## 条件与局限

这套推导成立需要同时满足：

1. 单色、标量、相干传播；
2. 两段自由传播均满足 Fresnel 近轴条件；
3. 透镜可视为理想薄透镜；
4. 物面与像面满足 Gaussian imaging equation；
5. 物面二次相位已被合理补偿，或其变化可以忽略；
6. 只在像差和渐晕变化较小的等晕区域内使用卷积模型。

若存在离焦或像差，可以把附加相位写进广义瞳函数

$$
P(u,v)\exp[jW(u,v)],
$$

再对它作傅里叶变换得到相应冲激响应。若 NA 很高、偏振效应显著或结构尺寸接近波长，则应离开标量薄透镜模型，改用矢量衍射或完整电磁模型。

## Take Home Message

- 理想薄透镜的核心作用是施加负二次相位；有限孔径由瞳函数 $P$ 描述。
- 线性使任意输入可以表示为点输入响应的叠加；只有再满足平移不变性，输出才能写成卷积。
- 两次传播与薄透镜在透镜面产生的二次相位，由 $1/z_1+1/z_2=1/f$ 抵消。
- 物面二次相位需要小视场近似、曲面物面或会聚球面波照明才能去掉；像面二次相位只在纯强度观察中可以忽略。
- 相干成像的振幅冲激响应是瞳函数的缩放傅里叶变换，点像尺寸因此由孔径衍射决定。
- Gaussian imaging equation 决定几何像点位置，瞳函数的傅里叶变换决定这个像点实际有多宽、形状如何。
- 瞳函数P、相干传递函数 $H_c$ 和冲激响应 $h_c$ 是同一件事在不同域中的表示。
  - $H_c = P(\lambda z f_x, \lambda z f_y)$
  - $h_c = \mathcal F^{-1}\{H_c\} = \mathcal F^{-1}\{P(\lambda z f_x, \lambda z f_y)\}$ 
  - 透镜起到了汇聚空间频率（让同一位置产生的光可以相干叠加）的作用（消除空间相位），而**有限孔径限制了可通过的空间频率范围**，因此传递函数全是和孔径相关的