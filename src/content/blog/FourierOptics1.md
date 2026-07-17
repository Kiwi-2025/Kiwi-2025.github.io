---
title:  Fourier Optics Note-1
date: 2026-07-01 23:46:05
categories:
- Notes
tags:
- Optics
featured: true
description: Based on Goodman’s book "Introduction to Fourier Optics"
---
## 2D Fourier Transform

类似于 1D 的傅里叶变换，对于一个定义在 $\mathbb{R}^2$ 上的函数 $g(x, y)$，其 2D 傅里叶变换的定义为：

$$
\mathcal{F}\{g(x, y)\} = G(f_x, f_y) = 
\iint_{-\infty}^{\infty} g(x, y) \exp \left[ -j2\pi(f_x x + f_y y) \right] \text{d} x \text{d} y
$$

可以定义 2D 傅里叶逆变换：
$$
\mathcal{F}^{-1}\{G(f_x, f_y)\} = g(x, y) = 
\iint_{-\infty}^{\infty} G(f_x, f_y) \exp \left[ j2\pi(f_x x + f_y y) \right] \text{d} f_x \text{d} f_y
$$

正变换和逆变换共享一个类似的积分核 $\exp \left[ \pm j2\pi(f_x x + f_y y) \right]$，后面轴对称情况的 Fourier-Bessel 积分也有类似的积分核 $\exp \left[ \pm j2\pi f r \cos(\theta - \phi) \right]$

## 广义函数

做傅里叶变换就绕不开 Dirac delta 函数 $\delta(x)$，它是一个广义函数（generalized function），也叫分布（distribution）。广义函数的概念是由 Schwartz 在 20 世纪 40 年代提出的，它是对传统函数概念的推广。

二维的 Dirac delta 函数 $\delta(x, y)$ 是一维 Dirac delta 函数 $\delta(x)$ 的推广，在Goodman 的书中被定义为一个函数的极限：

$$
\begin{aligned}
\delta(x, y) = \lim_{N \to \infty} N^2 \exp \left[ -\pi N^2 (x^2 + y^2) \right] \\
\delta(t) = \lim_{N \to \infty} N \exp \left[ -\pi N^2 t^2 \right]
\end{aligned}
$$

但其实广义函数不只有这一种定义，实际上是一系列函数的极限。（实际上goodman自己在后面的习题里也使用别的等价定义）

广义函数的定义是通过它们的作用来定义的，而不是通过它们的值来定义的。也就是说，广义函数是通过它们与测试函数的积分来定义的。

### Dirac $\delta$ 函数的不同形式

除了上面提到的极限形式，Dirac $\delta$ 函数还有其他几种常见的形式：

**1. 傅里叶积分表示**

$$
\delta(x) = \frac{1}{2\pi} \int_{-\infty}^{\infty} e^{j\omega x} \text{d}\omega
$$

这是 delta 函数最优美的表示形式，直接来自傅里叶逆变换。

**2. 利用矩形函数的极限表示**

$$
\begin{aligned}
\delta(x) = \lim_{N \to \infty} N \cdot \text{rect}(Nx) \\
\delta(x,y) = \lim_{N \to \infty} N^2 \cdot \text{rect}(Nx, Ny)
\end{aligned}
$$

其中 $\text{rect}(x)$ 是矩形函数，在 $|x| \leq \frac{1}{2}$ 时为 1，否则为 0。

**3. 利用 sinc 函数的极限表示**

$$
\delta(x) = \lim_{N \to \infty} N \cdot \text{sinc}(Nx)
$$


**4. 二维高斯函数的极限**

这就是 Goodman 书中给出的定义：
$$
\delta(x, y) = \lim_{N \to \infty} N^2 \exp \left[ -\pi N^2 (x^2 + y^2) \right]
$$

### 利用测试函数定义Dirac函数

Dirac 函数 $\delta(x)$ 的定义是通过它与测试函数 $\phi(x)$ 的积分来定义的：
$$
\langle \delta, \phi \rangle = \int_{-\infty}^{\infty} \delta(x) \phi(x) \text{d}x = \phi(0)
$$

只要满足这个条件，就可以认为 $\delta(x)$ 是一个广义函数。类似地，二维 Dirac 函数 $\delta(x, y)$ 的定义是：
$$
\langle \delta, \phi \rangle = \int_{-\infty}^{\infty} \int_{-\infty}^{\infty} \delta(x, y) \phi(x, y) \text{d}x \text{d}y = \phi(0, 0)
$$

## Fourier-Bessel 变换
对于可分离变量的函数其傅里叶变换可以写成两个一维傅里叶变换的乘积，这其中的一类更特殊的函数是径向对称函数（radially symmetric function），即 $g(x, y) = g(r)$，其中 $r = \sqrt{x^2 + y^2}$。对于这样的函数，其傅里叶变换也具有径向对称性，可以写成一个一维积分，这就是 Fourier-Bessel 变换。

如果 $g(r, \theta) = g_R(r)$，则其傅里叶变换为：
$$
F(g) = G_o(\rho, \phi) = \int_0^{2\pi} \int_0^{\infty} g_R(r) \exp \left[-j2\pi \rho r \cos(\theta - \phi)\right] r \text{d}r \text{d}\theta
$$

用Bessel函数的积分表示式可以将上式化简为：
$$
F(g) = G_o(\rho, \phi) = \int_0^{\infty} g_R(r) J_0(2\pi \rho r) r \text{d}r
$$

## Convolution Theorem
卷积定理可以认为是傅里叶变换中最重要的定理之一，它说明了卷积运算和傅里叶变换之间的关系。对于两个函数 $g(x, y)$ 和 $h(x, y)$，它们的二维卷积定义为：

$$
(g * h)(x, y) = \iint_{-\infty}^{\infty} g(u, v) h(x - u, y - v) \text{d}u \text{d}v
$$

### 卷积定理
两个信号在空间域中的卷积对应于它们在频率域中的乘积。具体来说，如果 $G(f_x, f_y)$ 和 $H(f_x, f_y)$ 分别是 $g(x, y)$ 和 $h(x, y)$ 的傅里叶变换，那么有：
$$
F(g * h) = F(g) \cdot F(h)
$$

同样地，两个信号在频率域中的卷积对应于它们在空间域中的乘积：
$$
F^{-1}(G * H) = F^{-1}(G) \cdot F^{-1}(H)
$$

### 卷积定理的证明

证明上面这个卷积定理，从定义出发暴力计算：
$$
\begin{gather*}
F(g * h) =& \iint_{-\infty}^{\infty} \iint_{-\infty}^{\infty} g(u, v) h(x - u, y - v) \text{d}u \text{d}v \cdot \exp[-j2\pi (f_x x + f_y y)] \text{d}x \text{d}y \\
=& \iint_{-\infty}^{\infty} g(u, v) \left[ \iint_{-\infty}^{\infty} h(x - u, y - v) \exp[-j2\pi (f_x x + f_y y)] \text{d}x \text{d}y \right] \text{d}u \text{d}v\\
=& \iint_{-\infty}^{\infty} g(u, v) \left[ \iint_{-\infty}^{\infty} h(x', y') \exp[-j2\pi (f_x (x' + u) + f_y (y' + v))] \text{d}x' \text{d}y' \right] \text{d}u \text{d}v\\
=& \iint_{-\infty}^{\infty} g(u, v) \left[ \iint_{-\infty}^{\infty} h(x', y') \exp[-j2\pi (f_x x' + f_y y')] \text{d}x' \text{d}y' \right] \exp[-j2\pi (f_x u + f_y v)] \text{d}u \text{d}v\\
=& \iint_{-\infty}^{\infty} g(u, v) \cdot H(f_x, f_y) \exp[-j2\pi (f_x u + f_y v)] \text{d}u \text{d}v\\
=&H(f_x, f_y) \cdot G(f_x, f_y) 

\end{gather*}
$$

### Local Spatial Frequency
如果 $g(x,y) = a(x,y) \cdot \exp[j\phi(x,y)]$，其中 $a(x,y)$ 是一个缓慢变化的函数，那么可以仅仅关注相位函数 $\phi(x,y)$ 的局部梯度来定义局部空间频率（local spatial frequency）：
$$
f_x(x,y) = \frac{1}{2\pi} \frac{\partial \phi(x,y)}{\partial x}, \quad f_y(x,y) = \frac{1}{2\pi} \frac{\partial \phi(x,y)}{\partial y}
$$

局部空间频率的定义是基于相位函数的局部变化率，它描述了信号在空间域中的频率特性。相对于傅里叶变换得到的全局频率，局部空间频率提供了信号在不同位置的频率信息。

傅里叶变换告诉我们包含一个高频成分，而局部空间频率告诉我们这个高频成分在空间域中出现的位置。

但是局部空间频率不能完全准确地描述信号的频率特性，因为它只考虑了相位函数的局部变化，而忽略了幅度函数的影响。对于幅度变化较快的信号，局部空间频率可能无法准确反映其频率特性。因此，在分析信号时，需要综合考虑幅度和相位的变化，以获得更全面的频率信息。
