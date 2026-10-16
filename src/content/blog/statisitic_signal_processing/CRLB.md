---
title:  Statistic Signal Processing Note-2
date: 2026-08-07 11:46:05
categories:
- Notes
tags:
- Statistic
- Mathematics
featured: true
description: Cramer-Rao Lower Bound (CRLB)
---

我们希望找到一个估计器（统计量），让这个统计量的方差尽可能小。Cramer-Rao Lower Bound (CRLB) 提供了一个无偏估计器方差的下界，任何无偏估计器的方差都不能低于这个下界。

如果能够找到一个无偏估计器的方差等于这个下界，那么这个估计器就是最优的无偏估计器（MVU）。

### Likelihood Function

似然函数 likelihood function 是一个关于参数 $\theta$ 的函数，定义为：

$$
p(x; \theta)
$$

似然函数的含义是：在观测到一组数据 $x$ 的情况下，参数 $\theta$ 取某个值的可能性有多大。它是一个关于参数 $\theta$ 的函数，而不是关于数据 $x$ 的函数。

## Cramer-Rao Lower Bound - Scalar Form

先考虑一些足够光滑的 PDF，即满足正则化条件(Regularity Condition)：
$$
\mathbb{E}\left[\frac{\partial \ln p(x;\theta)}{\partial \theta}\right] = 0  ,\forall \theta
$$

那么任何无偏估计器 $\hat{\theta}$ 都满足 Cramer-Rao Lower Bound (CRLB)：

$$
\operatorname{Var}(\hat{\theta}) \geq \frac{1}{-\,\mathbb{E}\!\left[\dfrac{\partial^2 \ln p(x;\theta)}{\partial \theta^2}\right]} = \frac{1}{I(\theta)}
$$

**explanation**：
- 正则化条件是对 $p(x;\theta)$ 求的期望，对x求的积分
- 二阶导数是关于 x 有关的随机变量，求期望是对数据x求期望，由下面方法计算：
    $$
        \mathbb{E}\left[\frac{\partial^2 \ln p(x;\theta)}{\partial \theta^2}\right] = \int \frac{\partial^2 \ln p(x;\theta)}{\partial \theta^2} p(x;\theta) dx
    $$

### 取等条件

对于估计器 $\hat{\theta} = g(x)$以及函数$I(\theta)$（ Fisher 信息，就是上面那个二阶导数的负期望），当且仅当
$$
    \frac{\partial \ln(p(x,\theta))}{\partial \theta} = I(\theta)(g(x) - \theta)
$$

取等的估计器能够让 score 函数被拆分成两个部分的乘积，前一个部分只依赖于参数 $\theta$，后一个部分只依赖于样本 $x$。**如果你算出来的 score 函数无法被拆分成两个部分的乘积，那么就说明不存在一个无偏估计器能够达到 CRLB。**

### Fisher 信息的两个等价标量形式

Fisher 信息可以用二阶导的负期望来表示，也可以用 score 函数的方差（一阶导平方）来表示：
$$
I(\theta) = -\,\mathbb{E}\!\left[\dfrac{\partial^2 \ln p(x;\theta)}{\partial \theta^2}\right] = \mathbb{E}\!\left[\left(\dfrac{\partial \ln p(x;\theta)}{\partial \theta}\right)^2\right]
$$

### Example: White Gaussian Noise

高斯白噪声是最常用的噪声，一个带有高斯白噪声的信号模型为：

$$
x[n] = s[n;\theta] + w[n], \quad n = 0,1,\ldots,N-1
$$

这个信号模型的似然函数为：

$$
p(x;\theta) = \prod_{n=0}^{N-1} \frac{1}{\sqrt{2\pi\sigma^2}} \exp\left(-\frac{(x[n] - s[n;\theta])^2}{2\sigma^2}\right) \\
= \left(\frac{1}{\sqrt{2\pi\sigma^2}}\right)^N \exp\left(-\frac{1}{2\sigma^2}\sum_{n=0}^{N-1}(x[n] - s[n;\theta])^2\right) 
$$

对数似然函数为：

$$
\ln p(x;\theta) = -\frac{N}{2}\ln(2\pi\sigma^2) - \frac{1}{2\sigma^2}\sum_{n=0}^{N-1}(x[n] - s[n;\theta])^2
$$

二次求导后得到：

$$
\dfrac{\partial^2 \ln p(x;\theta)}{\partial \theta^2} = \frac{1}{\sigma^2}\sum_{n=0}^{N-1} (x[n] - s[n;\theta]) \dfrac{\partial^2 s[n;\theta]}{\partial \theta^2} - \frac{1}{\sigma^2}\sum_{n=0}^{N-1} \left(\dfrac{\partial s[n;\theta]}{\partial \theta}\right)^2
$$

对数据 x 求期望，前面一项中s和s的偏导数都是关于参数 $\theta$ 的函数，和数据 x 无关可以提出来，而x的期望就是s，所以对数据 x 求期望后，前面一项为 0；后面平方项是s偏导的平方，也和x无关，求期望后不变，所以 Fisher 信息为：

$$
I(\theta) = -\,\mathbb{E}\!\left[\dfrac{\partial^2 \ln p(x;\theta)}{\partial \theta^2}\right] = \dfrac{1}{\sigma^2}\sum_{n=0}^{N-1} \left(\dfrac{\partial s[n;\theta]}{\partial \theta}\right)^2
$$

所以CRLB为：

$$
\operatorname{Var}(\hat{\theta}) \geq \frac{1}{I(\theta)} = \dfrac{\sigma^2}{\sum_{n=0}^{N-1} \left(\dfrac{\partial s[n;\theta]}{\partial \theta}\right)^2}
$$

## Cramer-Rao Lower Bound - Matrix Form

### Fisher Matrix

将问题推广到多维参数 $\mathbf{\theta} =(\theta_1, \theta_2, \ldots, \theta_n)^T $，则 Fisher 信息矩阵为：
$$
I(\mathbf{\theta}) = -\,\mathbb{E}\!\left[\frac{\partial^2 \ln p(x;\mathbf{\theta})}{\partial \mathbf{\theta} \partial \mathbf{\theta}^{\!T}}\right] = \mathbb{E}\!\left[\left(\frac{\partial \ln p(x;\mathbf{\theta})}{\partial \mathbf{\theta}}\right)\left(\frac{\partial \ln p(x;\mathbf{\theta})}{\partial \mathbf{\theta}}\right)^{\!\!T}\right]
$$

将其展开为 $n \times n$ 的矩阵形式，把负号与期望提到矩阵之外，矩阵内部即 log-likelihood 的 Hessian：

$$
I(\mathbf{\theta}) = -\,\mathbb{E}\left(\!\,\begin{bmatrix}
\dfrac{\partial^2 \ln p(x;\mathbf{\theta})}{\partial \theta_1^2} & \dfrac{\partial^2 \ln p(x;\mathbf{\theta})}{\partial \theta_1 \partial \theta_2} & \cdots & \dfrac{\partial^2 \ln p(x;\mathbf{\theta})}{\partial \theta_1 \partial \theta_n} \\[10pt]
\dfrac{\partial^2 \ln p(x;\mathbf{\theta})}{\partial \theta_2 \partial \theta_1} & \dfrac{\partial^2 \ln p(x;\mathbf{\theta})}{\partial \theta_2^2} & \cdots & \dfrac{\partial^2 \ln p(x;\mathbf{\theta})}{\partial \theta_2 \partial \theta_n} \\[10pt]
\vdots & \vdots & \ddots & \vdots \\[10pt]
\dfrac{\partial^2 \ln p(x;\mathbf{\theta})}{\partial \theta_n \partial \theta_1} & \dfrac{\partial^2 \ln p(x;\mathbf{\theta})}{\partial \theta_n \partial \theta_2} & \cdots & \dfrac{\partial^2 \ln p(x;\mathbf{\theta})}{\partial \theta_n^2}
\end{bmatrix}\right)
$$

其中第 $(i,j)$ 个元素为：

$$
[I(\mathbf{\theta})]_{ij} = -\,\mathbb{E}\!\left[\frac{\partial^2 \ln p(x;\mathbf{\theta})}{\partial \theta_i \partial \theta_j}\right]
$$

对于第 i 个参数 $\theta_i$ 的无偏估计器 $\hat{\theta}_i$，其方差满足：
$$
\operatorname{Var}(\hat{\theta}_i) \geq [I^{-1}(\mathbf{\theta})]_{ii}
$$

### Matrix Form of Cramer-Rao Lower Bound

在满足正则化条件，即：
$$
\mathbb{E}\left[\frac{\partial \ln p(\mathbf{x};\mathbf{\theta})}{\partial \mathbf{\theta}}\right] = 0  ,\forall \mathbf{\theta}
$$

那么对于任何无偏估计量 $\hat{\mathbf{\theta}}$，其协方差矩阵满足：
$$
\operatorname{Cov}(\hat{\mathbf{\theta}}) - I^{-1}(\mathbf{\theta}) \geq 0
$$

其中 $\geq 0$ 表示矩阵半正定。

**取等条件**当且仅当
$$
\frac{\partial \ln p(\mathbf{x};\mathbf{\theta})}{\partial \mathbf{\theta}} = I(\mathbf{\theta})(\hat{\mathbf{\theta}} - \mathbf{\theta})
$$

时取等号。这个估计量是 MVU（Minimum Variance Unbiased Estimator）估计量，他的协方差是 Fisher 信息矩阵的逆。

## 参数变换的 CRLB

如果我们希望计算一个参数变换 $\phi = g(\theta)$ 的 CRLB，那么我们可以使用以下公式：
$$
I(\phi) = \left(\frac{\partial g}{\partial \theta}\right)^T I(\theta) \left(\frac{\partial g}{\partial \theta}\right)\\
\operatorname{Cov}(\hat{\phi}) - \frac{\partial g(\theta)}{\partial \theta} I^{-1}(\theta) \left(\frac{\partial g(\theta)}{\partial \theta}\right)^T \geq 0
$$

## Example
### Example 1: Distance Estimation

