---
title:  Convex Functions
date: 2026-10-09 16:45:05
categories:
- Notes
tags:
- Convex Optimization
- Mathematics
featured: false
description: Based on Tsinghua University Convex Optimization Course
---

## 定义与图景

**【定义】** 函数 $f: \mathbb{R}^n \to \mathbb{R}$ 是**凸函数**（convex function），如果其定义域是凸集，且对任意 $x, y \in \mathbf{dom}\, f$ 和 $\theta \in [0, 1]$：

$$
f(\theta x + (1 - \theta) y) \leq \theta f(x) + (1 - \theta) f(y)
$$

几何意义：函数图像上任意两点之间的弦，永远不低于图像本身。当 $x \neq y$、$\theta \in (0,1)$ 时不等号严格成立，则称 $f$ **严格凸**（strictly convex）。

处理凸性时最好用的代数对象是 **epigraph**（上图集）：

$$
\mathbf{epi}\, f = \{(x, t) \in \mathbb{R}^{n+1} : f(x) \leq t\}
$$

**【定理】** $f$ 是凸函数 $\iff$ $\mathbf{epi}\, f$ 是凸集。

定义中的不等式正是"epigraph 对凸组合封闭"，两种说法完全等价。这个视角的价值在后面可见：许多保凸运算的证明在 epigraph 语言里只有一句话。

一个直接的推论：凸函数的**下行集** $\{x : f(x) \leq \alpha\}$ 必是凸集。反向不成立——下行集全凸的函数称为**拟凸函数**（quasiconvex），是比凸性更弱的性质。

## 典型例子

- 仿射函数 $a^T x + b$：既凸又凹，凸性与线性结构不冲突；
- 指数 $e^{ax}$；幂函数 $x^a$（$x > 0$，$a \geq 1$ 或 $a \leq 0$）；
- $\|x\|^p$（$p \geq 1$），$p=1$ 时即任意范数 $\|x\|$；
- 负熵 $x \log x$（$x \geq 0$，约定 $0 \log 0 = 0$）；
- 二次型 $x^T A x$（$A \succeq 0$）；
- 逐点最大 $\max\{x_1, \ldots, x_n\}$；
- **log-sum-exp** $\log\left(\sum_i e^{x_i}\right)$：$\max$ 的光滑近似，凸优化中最重要的"软最大"函数。

**凹函数**（$f$ 凹 $\iff$ $-f$ 凸，一切结论经此转换）：$\log x$、$\sqrt{x}$、几何平均 $\left(\prod_i x_i\right)^{1/n}$。

判断一个具体函数的凸性，惯用顺序是：**先试二阶条件，再拆成熟知函数的保凸组合**。

## 基本性质

### 一维引理

**【引理】** 可微一元函数 $g$ 凸 $\iff$ $g'$ 单调不减；二阶可微时，等价于 $g'' \geq 0$。


### 连续性

**【定理】** 定义在**开**凸集上的凸函数必连续。

由连续性（Weierstrass 定理）知凸函数在**紧集**上必取得最小值——这是存在性工具。更重要的是结构性工具：

- **局部极小即全局极小**：若 $x^*$ 是局部极小点而存在 $y$ 使 $f(y) < f(x^*)$，则线段 $x^* \to y$ 上靠近 $x^*$ 的点由凸组合公式取值严格小于 $f(x^*)$，与局部极小矛盾。


## 一阶条件

**【定理】** 设 $f$ 可微，则 $f$ 凸 $\iff$ 对任意 $x, y \in \mathbf{dom}\, f$：

$$
f(y) \geq f(x) + \nabla f(x)^T (y - x)
$$

**【证明】**

*必要性*：固定 $x, y$，令 $g(t) = f(x + t(y - x))$，$t \in [0, 1]$。$f$ 凸 $\Rightarrow$ $g$ 凸 $\Rightarrow$（一维引理）$g'$ 单调不减，而 $g'(t) = \nabla f(x + t(y-x))^T (y - x)$，故

$$
f(y) - f(x) = g(1) - g(0) = \int_0^1 g'(t)\, dt \geq g'(0) = \nabla f(x)^T (y - x)
$$

*充分性*：设 $z = \theta x + (1 - \theta) y$。对点对 $(z, x)$ 与 $(z, y)$ 分别使用一阶条件：

$$
f(x) \geq f(z) + \nabla f(z)^T (x - z), \qquad f(y) \geq f(z) + \nabla f(z)^T (y - z)
$$

按 $\theta$ 与 $1 - \theta$ 加权相加，梯度项恰好相消：

$$
\theta f(x) + (1 - \theta) f(y) \geq f(z) + \nabla f(z)^T \big(\theta(x - z) + (1 - \theta)(y - z)\big) = f(z)
$$

□

几何意义：**凸函数的图像永远在任意一点切平面的上方**——每一点的切平面都是全局下界（支撑超平面）。充分性证明中"加权相加消梯度"的技巧值得记住。

**【推论】** $f$ 可微且凸，则 $\nabla f(x^*) = 0 \iff x^*$ 是全局最小点。

凸优化的核心优势在此：最优性判定不需要搜索，解 $\nabla f = 0$ 即可，且解出的必然是全局最优。

## 二阶条件

**【定理】** 设 $f$ 二阶可微，则 $f$ 凸 $\iff$ 对任意 $x \in \mathbf{dom}\, f$：

$$
\nabla^2 f(x) \succeq 0
$$

**【证明】** 关键观察：**凸性是沿直线的性质**。$f$ 凸 $\iff$ 对任意 $x$ 与方向 $v$，一元函数 $g(t) = f(x + tv)$ 凸。链式法则给出

$$
g''(t) = v^T \nabla^2 f(x + tv)\, v
$$

*必要性*：$g$ 凸 $\Rightarrow$（一维引理）$g''(0) = v^T \nabla^2 f(x)\, v \geq 0$。由 $x, v$ 任意，$\nabla^2 f(x) \succeq 0$。

*充分性*：$\nabla^2 f \succeq 0$ 处处成立 $\Rightarrow$ 沿任意直线 $g''(t) \geq 0$ $\Rightarrow$（一维引理）$g$ 凸 $\Rightarrow$ $f$ 凸。□

二阶条件把全局的凸性判定降解为逐点的矩阵半正定性检查，是验证具体函数（二次型、log-sum-exp 等）最常用的工具。

## 保凸运算

简单的保凸运算直接列出：**非负数乘、非负加权和、仿射复合**（$f(Ax + b)$）。下面是几个需要一点技巧的。

### 逐点最大与上确界

**【定理】** $f_1, \ldots, f_m$ 凸，则 $f(x) = \max_i f_i(x)$ 凸。更一般地，若对每个固定的 $y$，$f(x, y)$ 关于 $x$ 凸，则 $g(x) = \sup_{y \in \mathcal{A}} f(x, y)$ 凸。

**【证明】** 一句话：

$$
\mathbf{epi}\Big(\max_i f_i\Big) = \bigcap_i \mathbf{epi}(f_i)
$$

而凸集的任意交仍是凸集；上确界情形是同一论证的（可能不可数的）推广。□

典型应用：支撑函数 $\sup_{s \in S} s^T x$、逐段线性函数，以及把结构写成上确界形式后保持凸性。

### 部分极小化

**【定理】** $f(x, y)$ 关于 $(x, y)$ 联合凸，则 $g(x) = \inf_y f(x, y)$ 凸。

注意与上一条互补：取 **sup** 保凸，取 **inf** 保凹。典型应用是联合凸问题中消去变量：$\inf_y \|x - y\|$（到凸集的距离函数）、Schur 补。

### 复合函数

**【定理】** $f(x) = h(g(x)) = h(g_1(x), \ldots, g_k(x))$，其中 $g: \mathbb{R}^n \to \mathbb{R}^k$，$h: \mathbb{R}^k \to \mathbb{R}$。则 $f$ 凸，若下列任一条件成立：

- $h$ 凸，每个 $g_i$ 凸，且 $\tilde h$（在 $\mathbf{dom}\, h$ 之外取 $+\infty$ 的扩展函数）逐分量非减；
- $h$ 凸，每个 $g_i$ 凹，且 $\tilde h$ 逐分量非增。

对标量输入（$x \in \mathbb{R}$，即 $g: \mathbb{R} \to \mathbb{R}^k$），直接求导两次即可看清条件为何如此搭配：

$$
f''(x) = g'(x)^T \nabla^2 h(g(x))\, g'(x) + \nabla h(g(x))^T g''(x)
$$

**【证明（标量情形）】** 第一项恒非负：$h$ 凸 $\Rightarrow$ $\nabla^2 h(g(x)) \succeq 0$。第二项的符号靠单调性配平：$\tilde h$ 逐分量非减 $\Rightarrow$ $\nabla h(g(x))$ 逐分量 $\geq 0$，而 $g_i$ 凸 $\Rightarrow$ $g_i''(x) \geq 0$，逐分量相乘再求和非负。两项之和 $\geq 0$，故 $f$ 凸。□

可见单调性条件的作用是保证 $\nabla h$ 与 $g''$ **符号匹配**，它不是技术性装饰。**反例**：$h(u) = 1/u$（凸、递减），$g(x) = x^2 + 1$（凸），则 $h(g(x)) = \frac{1}{x^2 + 1}$ 在 $x = 0$ 附近是凹的。

常用特例：

- $e^{g(x)}$ 凸，当 $g$ 凸；
- $\log g(x)$ 凹，当 $g$ 凹且恒正。

## 共轭函数

**【定义】** $f: \mathbb{R}^n \to \mathbb{R}$ 的**共轭函数**（conjugate function）：

$$
f^*(y) = \sup_{x \in \mathbb{R}^n} \left( y^T x - f(x) \right)
$$

该变换也称 **Legendre–Fenchel 变换**。几何上：把 $y^T x - f(x)$ 看作 $y$ 的函数，是以 $x$ 为斜率、截距 $-f(x)$ 的仿射函数；$f^*$ 取遍所有 $x$ 的上确界，即**一族支撑平面的包络**。

**【定理】** 无论 $f$ 是否凸，$f^*$ 总是凸的。

**【证明】** 一句话：$f^*$ 是一族关于 $y$ 的仿射函数的逐点上确界，由逐点上确界保凸立得。□

**【结论】**

- **Fenchel 不等式**：$x^T y \leq f(x) + f^*(y)$。由 $y^T x - f(x) \leq f^*(y)$ 直接得出，平凡但基本。
- 若 $f$ 严格凸且可微，则 $y = \nabla f(x)$ 时 Fenchel 不等式取等：$f(x) + f^*(\nabla f(x)) = x^T \nabla f(x)$，由此 $\nabla f^* = (\nabla f)^{-1}$——两个梯度互为反函数。
- **对合性**：$f$ 凸且闭（closed，一切连续凸函数都是闭的）时 $f^{**} = f$，共轭是凸函数世界的"无损变换"——对偶理论中目标函数能够来回转换的原因。

## 小结

判定凸性的工具箱，按优先级排列：

1. **二阶条件**——最直接，算 Hessian 的半正定性；
2. **一阶条件**——无 Hessian 或想看几何时用；
3. **定义 / epigraph**——最根本，适合处理分段、取最值等"不光滑"结构；
4. **保凸运算**——把函数拆解成已知凸函数的组合，往往一步到位。

共轭函数则是通往对偶理论的起点：它让"原问题"与"对偶问题"共享同一套凸性语言。
