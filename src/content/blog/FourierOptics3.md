---
title:  Fourier Optics Note-3
date: 2026-07-10 14:00:00
categories:
- Notes
tags:
- Optics
featured: false
description: Fresnel and Fraunhofer diffraction—physical pictures, validity conditions, and FFT sampling
---

# Fresnel 衍射与 Fraunhofer 衍射

Note-2 已经从 Huygens–Fresnel 原理走到 Rayleigh–Sommerfeld 解和角谱理论。这一节只解决一个更具体的问题：**在近轴标量传播的框架内，Fresnel 衍射怎样进一步变成 Fraunhofer 衍射？**

两者不是两种互相竞争的物理现象。Fraunhofer 衍射是在 Fresnel 积分中再忽略一个二次相位项得到的远场极限：

- Fresnel 衍射保留孔径内部的二次相位差，因此图样会随传播距离持续演化；
- Fraunhofer 衍射忽略这项相位差，因此观察到的图样就是孔径场的空间频谱，只随距离作尺度放大。

本文沿用 Note-2 的约定：虚数单位为 $j$，时间因子为 $e^{-j\omega t}$，自由传播相位为 $e^{jkr}$，其中 $k=2\pi/\lambda$。

# 从 RS-I 到 Fresnel 积分

Note-2 使用的第一类 Rayleigh–Sommerfeld 积分为

$$
U(P)=\frac{1}{j\lambda}
\iint_\Sigma U(Q)
\frac{e^{jkr}}{r}
\cos\theta
\,\mathrm dS.
$$

这个形式已经略去了完整 Green 函数导数中的 $1-1/(jkr)$ 修正，因此首先要求 $kr\gg1$。从这里得到 Fresnel 积分，不需要重新处理边界条件，只需要对传播核作近轴近似。

设输入点和观察点分别为

$$
Q=(x',y',0),
\qquad
P=(x,y,z),
$$

并记横向间距

$$
\rho^2=(x-x')^2+(y-y')^2.
$$

传播距离和倾斜因子为

$$
r=\sqrt{z^2+\rho^2},
\qquad
\cos\theta=\frac{z}{r}.
$$

也就是说，平面孔径的几何关系直接给出 $\cos\theta=z/r$。

## 第一步：近似缓慢变化的振幅

RS-I 积分核中的振幅部分可以合并为

$$
\frac{\cos\theta}{r}
=\frac{z}{r^2}
=\frac{z}{z^2+\rho^2}.
$$

在近轴条件 $\rho/z\ll1$ 下，

$$
\cos\theta\approx1,
\qquad
\frac{1}{r}\approx\frac{1}{z},
\qquad
\frac{\cos\theta}{r}\approx\frac{1}{z}.
$$

这里可以直接把 $r$ 换成 $z$，因为 $1/r$ 和 $\cos\theta$ 只缓慢改变振幅。

## 第二步：在相位中保留二次项

相位 $e^{jkr}$ 对很小的光程误差也很敏感，所以不能在指数中简单取 $r\approx z$。对距离作二项式展开：

$$
\begin{aligned}
r
&=z\sqrt{1+\frac{\rho^2}{z^2}}\\
&=z+\frac{\rho^2}{2z}
-\frac{\rho^4}{8z^3}+\cdots.
\end{aligned}
$$

Fresnel 近似保留二次项：

$$
r\approx z+\frac{\rho^2}{2z},
$$

从而

$$
e^{jkr}
\approx
e^{jkz}
\exp\left(\frac{jk\rho^2}{2z}\right).
$$

若参与积分的最大横向间距为 $\rho_{\max}$，被忽略的第一项相位误差约为

$$
\Delta\phi
\approx
\frac{k\rho_{\max}^4}{8z^3}.
$$

因此一个直接的工程检查是

$$
k\rho_{\max}^4/(8z^3)\ll1.
$$

后文将它简写为 $k\rho_{\max}^4/(8z^3)\ll1$。这里的 $\rho_{\max}$ 应覆盖所有真正参与计算的输入点与输出点组合，而不能只使用孔径半径或观察窗口半径中的一个。

## 第三步：代回 RS-I

令 $U(Q)=U_0(x',y')$，$\mathrm dS=\mathrm dx'\mathrm dy'$，把振幅与相位近似代回 RS-I：

$$
U(x,y;z)\approx
\frac{e^{jkz}}{j\lambda z}
\iint U_0(x',y')
\exp\left\{
\frac{jk}{2z}
\left[(x-x')^2+(y-y')^2\right]
\right\}
\mathrm dx'\mathrm dy'.
$$

这就是 Fresnel 衍射积分。整个过程可以压缩成

$$
\boxed{
\frac{e^{jkr}}{r}\cos\theta
\;\longrightarrow\;
\frac{e^{jkz}}{z}
\exp\left(\frac{jk\rho^2}{2z}\right)
}
$$

其中振幅只保留零阶项，相位则必须保留到 $\rho^2$。Fresnel 积分因此仍是近轴近似；后面讨论 Fraunhofer 条件时，默认这一层近似首先成立。此时**传播不仅改变图样尺度，也在持续重新组织干涉关系。**

# Fresnel 积分的傅里叶变换形式

展开积分核中的平方项：

$$
\begin{aligned}
(x-x')^2+(y-y')^2
=&\ x^2+y^2+x'^2+y'^2\\
&-2(xx'+yy').
\end{aligned}
$$

于是

$$
\begin{aligned}
U(x,y;z)=&\
\frac{e^{jkz}}{j\lambda z}
\exp\left[\frac{jk}{2z}(x^2+y^2)\right]\\
&\times
\iint U_0(x',y')
\exp\left[\frac{jk}{2z}(x'^2+y'^2)\right]\\
&\qquad\times
\exp\left[-j2\pi
\left(
\frac{x}{\lambda z}x'
+\frac{y}{\lambda z}y'
\right)
\right]
\mathrm dx'\mathrm dy'.
\end{aligned}
$$

如果二维傅里叶变换定义为

$$
\mathcal F\{g(x',y')\}(f_x,f_y)
=
\iint g(x',y')
e^{-j2\pi(f_xx'+f_yy')}
\mathrm dx'\mathrm dy',
$$

那么 Fresnel 传播可以读成三步：

1. 给输入场乘上与 $z$ 有关的二次相位；
2. 作二维傅里叶变换；
3. 在 $f_x=x/(\lambda z)$、$f_y=y/(\lambda z)$ 处读取频谱，再乘输出二次相位和幅度系数。

也就是说，Fresnel 图样不是 $U_0$ 的直接傅里叶变换，而是

$$
U_0(x',y')
\exp\left[\frac{j\pi}{\lambda z}(x'^2+y'^2)\right]
$$

的傅里叶变换。

# Fraunhofer 衍射：输入二次相位可以忽略

如果输入孔径范围内

$$
\exp\left[\frac{j\pi}{\lambda z}(x'^2+y'^2)\right]
\approx 1,
$$

Fresnel 积分就化为

$$
U_{\mathrm{FF}}(x,y;z)=
\frac{e^{jkz}}{j\lambda z}
\exp\left[\frac{jk}{2z}(x^2+y^2)\right]
A\left(\frac{x}{\lambda z},\frac{y}{\lambda z}\right),
$$

其中

$$
A(f_x,f_y)=\mathcal F\{U_0(x',y')\}.
$$

这就是 Fraunhofer 衍射公式。除了一个已知的球面相位和 $1/z$ 幅度衰减，**远场复振幅就是输入复振幅的二维傅里叶变换。**

## 哪个相位被忽略了

被忽略的是**输入坐标的二次相位**

$$
\phi_{\mathrm{in}}(x',y')
=\frac{\pi}{\lambda z}(x'^2+y'^2).
$$

输出面的相位

$$
\exp\left[\frac{jk}{2z}(x^2+y^2)\right]
$$

并没有消失。它不改变单个观察面上的强度，所以只看衍射图样时常被省略；但在相干叠加、数字全息、相位恢复或继续传播时必须保留。

# Fraunhofer 条件怎样判断

令孔径内最大的径向坐标为

$$
a=\max\sqrt{x'^2+y'^2}.
$$

输入二次相位的最大值为

$$
\phi_{\max}=\frac{\pi a^2}{\lambda z}.
$$

Fraunhofer 近似要求这项相位足够小。比笼统地说“距离很远”更实用的写法是先规定允许相位误差 $\varepsilon$：

$$
\phi_{\max}\leq\varepsilon
\quad\Longrightarrow\quad
z\geq\frac{\pi a^2}{\lambda\varepsilon}.
$$

因此不存在脱离误差要求的唯一“远场起点”。如果采用不同的孔径尺寸定义和相位容差，就会得到不同的常数系数。

## 与 Fresnel number 的关系

对半径为 $a$ 的孔径，定义

$$
N_F=\frac{a^2}{\lambda z},
$$

则

$$
\phi_{\max}=\pi N_F.
$$

因此 $N_F\ll1$ 是常见的 Fraunhofer 判据。它的真正含义是：孔径边缘相对于中心，由自由传播引入的二次相位已经很小。

若使用孔径直径 $D=2a$，并允许边缘二次相位不超过 $\pi/8$，便得到常见的保守距离

$$
z\gtrsim\frac{2D^2}{\lambda}.
$$

这只是选定 $\pi/8$ 相位容差后的工程规则，不是自然界的一条硬边界。实际系统应按允许的复振幅或强度误差选择判据。

# 夫琅禾费衍射衍射图案=角谱

Note-2 用方向余弦 $(\alpha,\beta,\gamma)$ 表示平面波方向，并写出角谱

$$
A\left(\frac{\alpha}{\lambda},
\frac{\beta}{\lambda}\right).
$$

对远处观察点，近轴条件下

$$
\alpha\approx\frac{x}{z},
\qquad
\beta\approx\frac{y}{z}.
$$

因此

$$
A\left(\frac{x}{\lambda z},
\frac{y}{\lambda z}\right)
\approx
A\left(\frac{\alpha}{\lambda},
\frac{\beta}{\lambda}\right).
$$

这说明 Fraunhofer 图样不是传播到远处后才“新产生”的东西。输入面上的角谱早已包含所有传播方向；远场只是把不同方向的平面波在空间中分开，使位置 $(x,y)$ 对应方向 $(\alpha,\beta)$。

## 为什么远场图样只作尺度放大

Fraunhofer 强度为

$$
I_{\mathrm{FF}}(x,y;z)
=
\frac{1}{(\lambda z)^2}
\left|
A\left(\frac{x}{\lambda z},
\frac{y}{\lambda z}\right)
\right|^2.
$$

若改用角坐标 $\alpha=x/z$、$\beta=y/z$，频谱形状与 $z$ 无关。传播距离增大时：

- 同一角度落到更远的横向位置，所以图样线性变大；
- 振幅按 $1/z$ 衰减，强度按 $1/z^2$ 衰减；
- 以角度为横轴观察时，图样形状不再变化。

这与 Fresnel 图样形成鲜明对比：Fresnel 图样的内部干涉结构本身仍随 $z$ 演化。

# 用透镜把远场搬到有限距离

真实实验中，Fraunhofer 距离可能非常大。薄透镜可以把不同传播方向的平面波聚焦到后焦面上的不同位置，从而在有限距离内显示角谱。

焦距为 $f$ 的理想薄透镜具有二次相位

$$
t_L(x',y')=
P(x',y')
\exp\left[-\frac{jk}{2f}(x'^2+y'^2)\right],
$$

其中 $P(x',y')$ 是透镜的有限孔径。透镜后的场再传播距离 $f$ 时，这个负二次相位会与 Fresnel 核中的输入二次相位抵消。因此，在忽略已知比例因子和输出二次相位后，后焦面场为

$$
U_f(x,y)\propto
\mathcal F\{U_L(x',y')P(x',y')\}
\left(
\frac{x}{\lambda f},
\frac{y}{\lambda f}
\right),
$$

其中 $U_L$ 是入射到透镜平面的场。

于是后焦面坐标与方向余弦满足

$$
x\approx f\alpha,
\qquad
y\approx f\beta.
$$

## 工程上要注意什么

- 后焦面显示的是**透镜入射面场与透镜孔径乘积**的频谱；有限口径会截断输入并限制可收集的角谱。
- “后焦面强度是傅里叶谱强度”不等于复振幅没有额外相位；相干系统仍需保留相位因子。
- 高 NA 时 $x\approx f\alpha$ 的近轴映射和标量薄透镜模型都会失准，应改用更合适的矢量聚焦模型。
- 若探测器不能直接放在内部后焦面，可以用后续成像系统把该平面共轭到相机上。

# 两个基准孔径

解析孔径是检查推导和数值程序最有效的基准。

## 矩形孔径：sinc 频谱

设均匀矩形孔径宽度为 $a$、高度为 $b$：

$$
U_0(x',y')=
\operatorname{rect}\left(\frac{x'}{a}\right)
\operatorname{rect}\left(\frac{y'}{b}\right).
$$

定义归一化 sinc 函数

$$
\operatorname{sinc}(u)=\frac{\sin(\pi u)}{\pi u},
$$

则其角谱为

$$
A(f_x,f_y)=ab\,
\operatorname{sinc}(af_x)
\operatorname{sinc}(bf_y).
$$

Fraunhofer 强度为两个 $\operatorname{sinc}^2$ 的乘积。沿 $x$ 方向的第一对零点满足

$$
x=\pm\frac{\lambda z}{a},
$$

在透镜后焦面则将 $z$ 换成 $f$。孔径越窄，远场主瓣越宽，这是空间宽度与频谱宽度互相制约的直接表现。

## 圆孔：Airy 图样

设均匀圆孔半径为 $a$、直径为 $D=2a$。其频谱具有圆对称性：

$$
A(\rho_f)=
\pi a^2
\frac{2J_1(2\pi a\rho_f)}{2\pi a\rho_f},
$$

其中

$$
\rho_f=\sqrt{f_x^2+f_y^2}.
$$

强度中心亮斑及其同心旁瓣称为 Airy pattern。第一暗环对应

$$
\sin\theta\approx1.22\frac{\lambda}{D}.
$$

在近轴观察面上，第一暗环半径为

$$
r_{\mathrm{Airy}}\approx
1.22\frac{\lambda z}{D},
$$

在透镜后焦面则为 $1.22\lambda f/D$。这既是圆孔 Fraunhofer 公式的结果，也是衍射极限中最常见的尺度。

# Fresnel 还是 Fraunhofer

选择方法时不必先问“这是近场还是远场”，而应先问哪些相位可以忽略。

使用 **Fresnel 积分**，如果：

- 输入二次相位在孔径内不可忽略；
- 图样会随传播距离发生非缩放式变化；
- 需要描述边缘附近、Talbot 类演化或有限距离的衍射结构；
- 同时仍满足标量和近轴条件。

使用 **Fraunhofer 积分**，如果：

- 最大输入二次相位低于系统允许误差；
- 关心的是方向分布、远场发散角或孔径频谱；
- 只需一次傅里叶变换即可得到所需观察面；
- 或者使用透镜把角谱映射到后焦面。

如果近轴条件本身不成立，就不要在 Fresnel 与 Fraunhofer 之间继续选择，应回到 Note-2 的角谱法、Rayleigh–Sommerfeld 积分或矢量模型。

# Take Home Message

- Fresnel 积分是带输入二次相位的傅里叶变换；Fraunhofer 积分则忽略这项二次相位。
- Fraunhofer 条件的本质是孔径范围内的最大相位误差足够小，而不是距离超过某个绝对数值。
- 远场图样就是角谱强度；位置坐标通过 $f_x=x/(\lambda z)$、$f_y=y/(\lambda z)$ 映射到空间频率。
- 透镜把不同方向的平面波聚焦到后焦面的不同位置，从而在有限距离显示 Fraunhofer 图样。
- FFT 给出的是离散频谱；只有补上波长、传播距离、输入采样和归一化，数组索引才变成真实的光学坐标。
